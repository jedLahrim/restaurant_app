import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-twitter';

@Injectable()
export class TwitterStrategy extends PassportStrategy(Strategy, 'twitter') {
  constructor() {
    super({
      consumerKey: 'YOUR_APP_ID',
      consumerSecret: 'YOUR_APP_SECRET',
      callbackURL: 'http://localhost:3000/api/user/twitter/callback',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done,
  ): Promise<any> {
    const { id, displayName } = profile;
    const user = {
      id: id,
      name: displayName,
      accessToken,
    };

    return done(null, user);
  }
}
