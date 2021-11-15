import * as bcrypt from 'bcrypt';
import sha256 from 'crypto-js/sha256';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
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

@Injectable()
export default class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.getUser({ username });

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
    if (await this.isExistedUsername(dto.username)) {
      throw new ConflictException();
    }

    const newUser = await this.usersService.create(dto);
    return this.login(newUser);
  }

  async socialLogin(type: string, userInfo: { id: string }) {
    const user = await this.usersService.getOrCreateOauthUser(type, userInfo);
    return user;
  }

  async isExistedUsername(username: string) {
    const duplicatedUser = await this.usersService.getUser({
      username,
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
      user: { username: user.username },
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
