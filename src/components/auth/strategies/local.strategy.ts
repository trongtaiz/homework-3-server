import { Strategy } from 'passport-local';
import { validate } from 'class-validator';
import { Request as ExpressRequest } from 'express';
import { PassportStrategy } from '@nestjs/passport';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtTokenPayload } from '../interfaces/jwt-token-payload.interface';
import SignInDto from '../dto/sign-in.dto';
import AuthService from '../auth.service';

@Injectable()
export default class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(
    req: ExpressRequest,
    username: string,
    password: string,
  ): Promise<JwtTokenPayload> {
    const errors = await validate(new SignInDto(req.body));

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const user = await this.authService.validateUser(username, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}