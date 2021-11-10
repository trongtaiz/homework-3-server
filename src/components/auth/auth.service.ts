import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import UsersService from '@components/user/users.service';
import { JwtTokenPayload } from './interfaces/jwt-token-payload.interface';
import JWT_CONST from 'src/common/constants/jwt.constant';
import SignUpDto from './dto/sign-up.dto';

@Injectable()
export default class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
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

    return {
      accessToken,
      refreshToken,
    };
  }

  // public async refreshToken(refreshToken: string) {}
}
