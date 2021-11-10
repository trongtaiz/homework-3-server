import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import JWT_CONST from 'src/common/constants/jwt.constant';
import { JwtTokenPayload } from '@components/auth/interfaces/jwt-token-payload.interface';

@Injectable()
export default class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'refreshToken',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.REFRESH_TOKEN_SECRET,
    });
  }

  async validate(payload: JwtTokenPayload) {
    return payload;
  }
}
