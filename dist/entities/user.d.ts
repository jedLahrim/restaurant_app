import { Restaurant } from "./restaurant.entity";
export declare class User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    activated: boolean;
    access: string;
    refresh: string;
    refresh_expire_at: Date;
    access_expire_at: Date;
    restaurant: Restaurant[];
}
