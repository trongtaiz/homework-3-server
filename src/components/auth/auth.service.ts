import * as bcrypt from 'bcrypt';
import sha256 from 'crypto-js/sha256';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import UsersService from '@components/users/users.service';
import { JwtTokenPayload } from './interfaces/jwt-token-payload.interface';
import JWT_CONST from 'src/common/constants/jwt.constant';
import SignUpDto from './dto/sign-up.dto';
import { InjectRepository } from '@nestjs/typeorm';
import AuthEntity from './entities/auth.entity';
import { Repository } from 'typeorm';

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

    const passwordCompared = await bcrypt.compare(password, user.password);

    if (passwordCompared) {
      return {
        id: user.id,
      };
    }

    return null;
  }

  async signUp(dto: SignUpDto) {
    if (await this.isExistedUsername(dto.username)) {
      throw new ConflictException();
    }

    const newUser = await this.usersService.create(dto);
    return this.login({ id: newUser.id });
  }

  async isExistedUsername(username: string) {
    const duplicatedUser = await this.usersService.getUser({
      username,
    });

    return duplicatedUser ? true : false;
  }

  async login(jwtTokenPayload: JwtTokenPayload) {
    const accessToken = this.jwtService.sign(jwtTokenPayload, {
      expiresIn: JWT_CONST.ACCESS_TOKEN_EXPIRED,
      secret: process.env.ACCESS_TOKEN_SECRET,
    });
    const refreshToken = this.jwtService.sign(jwtTokenPayload, {
      expiresIn: JWT_CONST.REFRESH_TOKEN_EXPIRED,
      secret: process.env.REFRESH_TOKEN_SECRET,
    });

    const hashedRefreshToken = sha256(refreshToken).toString();

    await this.authRepository.save({
      userId: jwtTokenPayload.id,
      hashedRefreshToken,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  public async refreshToken(
    jwtTokenPayload: JwtTokenPayload,
    refreshToken: string,
  ) {
    // const jwtTokenPayload: JwtTokenPayload = await this.jwtService
    //   .verifyAsync(refreshToken, {
    //     secret: process.env.REFRESH_TOKEN_SECRET,
    //   })
    //   .catch((_) => {
    //     throw new UnauthorizedException('Invalid or expired refresh token');
    //   });

    Logger.debug('jwtTokenPayload: ' + JSON.stringify(jwtTokenPayload));
    Logger.debug('refreshToken: ' + refreshToken);

    const hashedRefreshToken = sha256(refreshToken).toString();

    Logger.debug(`hashedRefreshToken: ${hashedRefreshToken}`);

    const foundAuth = await this.authRepository.findOne({
      userId: jwtTokenPayload.id,
      hashedRefreshToken,
    });

    if (!foundAuth) throw new ForbiddenException();

    const accessToken = this.jwtService.sign(jwtTokenPayload, {
      expiresIn: JWT_CONST.ACCESS_TOKEN_EXPIRED,
      secret: process.env.ACCESS_TOKEN_SECRET,
    });

    return accessToken;
  }
}
