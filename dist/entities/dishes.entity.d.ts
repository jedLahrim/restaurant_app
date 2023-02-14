import { Restaurant } from "./restaurant.entity";
export declare class Dishes {
    id: string;
    name: string;
    price: number;
    photoUrl?: string;
    description: string;
    restaurant: Restaurant;
}
