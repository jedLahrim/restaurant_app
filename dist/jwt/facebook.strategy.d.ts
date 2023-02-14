import { Strategy, Profile } from 'passport-facebook';
declare const FacebookStrategy_base: new (...args: any[]) => Strategy;
export declare class FacebookStrategy extends FacebookStrategy_base {
    constructor();
    validate(accessToken: string, refreshToken: string, profile: Profile, cb: any): Promise<any>;
}
export {};
