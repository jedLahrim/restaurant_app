import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { VerifyCallback } from 'passport-jwt';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor() {
    super({
      clientID: '3128253640800276',
      clientSecret: 'de07bcce23b0d7882a572a5621d508f3',
      callbackURL: 'http://localhost:4060/user/facebook/callback',
      profileFields: ['id', 'displayName', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    cb,
  ): Promise<any> {
    const { id, displayName } = profile;
    const user = {
      id: id,
      name: displayName,
      accessToken,
    };

    return cb(null, user);
  }
}
