import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import PassportFacebookToken, { Profile } from 'passport-facebook-token';
import express from 'express';
import AuthService from '../auth.service';

@Injectable()
export default class FacebookTokenStrategy extends PassportStrategy(
  PassportFacebookToken,
  'facebook-token',
) {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      fbGraphVersion: 'v3.0',
      profileFields: ['email', 'first_name', 'last_name', 'picture'],
      passReqToCallback: true,
    });
  }

  async validate(
    req: express.Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any, info?: any) => void,
  ) {
    // {
    //   "email": "hdaicenter@gmail.com",
    //   "first_name": "Đại",
    //   "last_name": "Huỳnh",
    //   "picture": {
    //     "data": {
    //       "height": 50,
    //       "is_silhouette": false,
    //       "url": "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=2134262636721798&height=50&width=50&ext=1639496995&hash=AeR7xQkpETVjk65KqIo",
    //       "width": 50
    //     }
    //   },
    //   "id": "2134262636721798"
    // }
    const {
      // email,
      // first_name: firstName,
      // last_name: lastName,
      id,
    } = profile._json;
    Logger.debug(`facebook _json: ${JSON.stringify(profile._json, null, 2)}`);

    const user = await this.authService.socialLogin('fb', { id });

    done(null, user);
  }
}
