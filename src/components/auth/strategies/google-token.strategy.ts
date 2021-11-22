import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { Strategy } from 'passport-google-verify-token';
import express from 'express';
import AuthService from '../auth.service';

@Injectable()
export default class GoogleTokenStrategy extends PassportStrategy(
  Strategy,
  'google-token',
) {
  constructor(private authService: AuthService) {
    super({
      audience: [process.env.GOOGLE_APP_ID],
      passReqToCallback: true,
    });
  }

  async validate(
    req: express.Request,
    parsedToken: any,
    googleId: string,
    done: any,
  ) {
    // {
    //   "iss": "accounts.google.com",
    //   "azp": "880606660073-nimp0fn16r1qjrqkl3i093loe4oeplts.apps.googleusercontent.com",
    //   "aud": "880606660073-nimp0fn16r1qjrqkl3i093loe4oeplts.apps.googleusercontent.com",
    //   "sub": "115762878243073538137",
    //   "email": "hdaicenter@gmail.com",
    //   "email_verified": true,
    //   "at_hash": "ZxTTApjZAlFALoY1XBUTTQ",
    //   "name": "Đại Huỳnh",
    //   "picture": "https://lh3.googleusercontent.com/a-/AOh14GgqBHnyTSkIYn75kJRbn0GEtepEldgICpo596wzsQ=s96-c",
    //   "given_name": "Đại",
    //   "family_name": "Huỳnh",
    //   "locale": "vi",
    //   "iat": 1636904602,
    //   "exp": 1636908202,
    //   "jti": "ecc6d29c100bab9dd911b01decdbe02c61bece46"
    // }

    const { name, email } = parsedToken;

    Logger.debug(`parsedToken: ${JSON.stringify(parsedToken, null, 2)}`);

    const user = await this.authService.socialLogin('gg', {
      id: googleId,
      name,
      email,
    });

    done(null, user);
  }
}
