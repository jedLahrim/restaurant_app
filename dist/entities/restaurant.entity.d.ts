import { Category } from "./category.entity";
import { User } from "./user";
import { Dishes } from "./dishes.entity";
export declare class Restaurant {
    id: string;
    name: string;
    coverImage: string;
    address: string;
    isPromoted: boolean;
    category: Category;
    owner: User;
    menu: Dishes[];
}
