import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { JwtTokenPayload } from '@components/auth/interfaces/jwt-token-payload.interface';
import JWT_CONST from 'src/common/constants/jwt.constant';

@Injectable()
export default class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'accessToken',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,      
    });
  }

  async validate(payload: JwtTokenPayload) {
    Logger.log('JWT access strategy');
    return payload;
  }
}
