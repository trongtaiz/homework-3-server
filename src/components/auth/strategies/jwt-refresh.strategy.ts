import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { JwtTokenPayload } from '@components/auth/interfaces/jwt-token-payload.interface';
import _ from 'lodash';

@Injectable()
export default class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'refreshToken',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: process.env.REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, jwtTokenPayload: JwtTokenPayload) {
    return {
      jwtTokenPayload: _.omit(jwtTokenPayload, ['iat', 'exp']),
      refreshToken: request.body['refreshToken'],
    };
  }
}
