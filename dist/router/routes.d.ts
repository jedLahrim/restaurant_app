import { UserService } from "../services/user.service";
import { JwtStrategy } from "../jwt/jwt.strategy";
import { RestaurantService } from "../services/restaurants.service";
declare const routes: ({
    method: string;
    route: string;
    strategy: typeof JwtStrategy;
    service: typeof UserService;
    action: string;
    guard: string;
    validation: (import("express-validator").ValidationChain | import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>)[];
} | {
    method: string;
    route: string;
    service: typeof UserService;
    action: string;
    validation: any[];
    strategy?: undefined;
    guard?: undefined;
} | {
    method: string;
    route: string;
    service: typeof RestaurantService;
    action: string;
    validation: any[];
    strategy?: undefined;
    guard?: undefined;
})[];
export default routes;
