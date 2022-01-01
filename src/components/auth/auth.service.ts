import * as bcrypt from 'bcrypt';
import sha256 from 'crypto-js/sha256';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import UsersService from '@components/users/users.service';
import { JwtTokenPayload } from './interfaces/jwt-token-payload.interface';
import JWT_CONST from 'src/common/constants/jwt.constant';
import SignUpDto from './dto/sign-up.dto';
import { InjectRepository } from '@nestjs/typeorm';
import AuthEntity from './entities/auth.entity';
import { Repository } from 'typeorm';
import UserEntity from '@components/users/entities/users.entity';
import { MailUtil } from '@utils/mail.util';

@Injectable()
export default class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
    private readonly mailUtil: MailUtil,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.getUser({ email });

    console.log(user);

    if (!user?.isActive)
      throw new BadRequestException('Account has not been activated');

    if (!user) {
      throw new NotFoundException();
    }

    const passwordCompared = await bcrypt.compare(password, user.password!);

    if (passwordCompared) {
      return user;
    }

    return null;
  }

  async signUp(dto: SignUpDto) {
    if (await this.isExistedEmail(dto.email)) {
      throw new ConflictException();
    }

    const newUser = await this.usersService.create(dto);

    // send email
    const verifyToken = this.jwtService.sign(
      { id: newUser.id },
      { secret: process.env.VERIFY_EMAIL_SECRET, expiresIn: 10 * 60 * 1000 },
    );
    await this.mailUtil.sendVerifyEmail(verifyToken, newUser.email!);

    return { message: 'Activation link sent to email' };
    // return this.login(newUser);
  }

  async verifyEmail(token: string) {
    const { id } = await this.jwtService
      .verifyAsync(token, {
        secret: process.env.VERIFY_EMAIL_SECRET,
      })
      .catch((err) => {
        throw new UnauthorizedException();
      });

    // successfully verify email
    const data = await this.usersService
      .getRepository()
      .update({ id }, { isActive: true });

    if (data.affected == 0) throw new BadRequestException();
    return { message: 'successfully verify email' };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.getUser({ email });

    if (!user) throw new NotFoundException();

    // send email
    const token = await this.jwtService.sign(
      { id: user.id },
      { secret: process.env.FORGOT_PW_SECRET, expiresIn: 5 * 60 * 1000 },
    );
    await this.mailUtil.sendForgotPassword(token, email);
    return { message: 'Reset password link sent to email' };
  }

  async resetPassword(verifyToken: string, newPassword: string) {
    const { id } = await this.jwtService
      .verifyAsync(verifyToken, {
        secret: process.env.FORGOT_PW_SECRET,
      })
      .catch((error) => {
        throw new UnauthorizedException();
      });

    // update pw
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    const data = await this.usersService
      .getRepository()
      .update({ id }, { password: hashedPassword });

    if (data.affected === 0) throw new BadRequestException();
    return { message: 'Password reset successfully' };
  }

  async socialLogin(
    type: string,
    userInfo: { id: string; email: string; name: string },
  ) {
    const user = await this.usersService.getOrCreateOauthUser(type, userInfo);
    return user;
  }

  async isExistedEmail(email: string) {
    const duplicatedUser = await this.usersService.getUser({
      email,
    });

    return duplicatedUser ? true : false;
  }

  async login(user: UserEntity) {
    const jwtTokenPayload: JwtTokenPayload = {
      id: user.id,
    };

    const accessToken = this.jwtService.sign(jwtTokenPayload, {
      expiresIn: JWT_CONST.ACCESS_TOKEN_EXPIRED,
      secret: process.env.ACCESS_TOKEN_SECRET,
    });
    const refreshToken = this.jwtService.sign(jwtTokenPayload, {
      expiresIn: JWT_CONST.REFRESH_TOKEN_EXPIRED,
      secret: process.env.REFRESH_TOKEN_SECRET,
    });

    const hashedRefreshToken = sha256(refreshToken).toString();

    await this.authRepository.save(
      this.authRepository.create({
        userId: jwtTokenPayload.id,
        hashedRefreshToken,
      }),
    );

    return {
      accessToken,
      refreshToken,
      user: { email: user.email, name: user.name, id: user.id },
    };
  }

  public async refreshToken(
    jwtTokenPayload: JwtTokenPayload,
    refreshToken: string,
  ) {
    // Logger.debug('jwtTokenPayload: ' + JSON.stringify(jwtTokenPayload));
    // Logger.debug('refreshToken: ' + refreshToken);

    const hashedRefreshToken = sha256(refreshToken).toString();

    // Logger.debug(`hashedRefreshToken: ${hashedRefreshToken}`);

    const foundAuth = await this.authRepository.findOne({
      userId: jwtTokenPayload.id,
      hashedRefreshToken,
    });

    if (!foundAuth) throw new UnauthorizedException();

    const accessToken = this.jwtService.sign(jwtTokenPayload, {
      expiresIn: JWT_CONST.ACCESS_TOKEN_EXPIRED,
      secret: process.env.ACCESS_TOKEN_SECRET,
    });

    return accessToken;
  }

  public async signOut(jwtTokenPayload: JwtTokenPayload, refreshToken: string) {
    const hashedRefreshToken = sha256(refreshToken).toString();

    const deleteResult = await this.authRepository.delete({
      userId: jwtTokenPayload.id,
      hashedRefreshToken,
    });

    if (deleteResult.affected === 0) throw new UnauthorizedException();

    return { message: 'successfully signed out' };
  }
}
