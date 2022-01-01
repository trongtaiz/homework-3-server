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
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(
    req: ExpressRequest,
    email: string,
    password: string,
  ): Promise<JwtTokenPayload> {
    console.log(req.body);

    const errors = await validate(new SignInDto(req.body));

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
