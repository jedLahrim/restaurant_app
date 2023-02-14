import { Profile, Strategy } from 'passport-twitter';
declare const TwitterStrategy_base: new (...args: any[]) => Strategy;
export declare class TwitterStrategy extends TwitterStrategy_base {
    constructor();
    validate(accessToken: string, refreshToken: string, profile: Profile, done: any): Promise<any>;
}
export {};
