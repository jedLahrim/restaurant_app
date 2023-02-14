import { Repository } from "typeorm";
import { Category } from "../entities/category.entity";
import { Request, Response } from "express";
import { Restaurant } from "../entities/restaurant.entity";
import { Dishes } from "../entities/dishes.entity";
export declare class RestaurantService {
    private readonly restaurants;
    private readonly dishes;
    private readonly category;
    constructor(restaurants: Repository<Restaurant>, dishes: Repository<Dishes>, category: Repository<Category>);
    createRestaurant(req: Request, res: Response): Promise<Restaurant>;
    _findOrCreateCategory(req: any): Promise<any>;
    editRestaurant(req: Request, res: Response): Promise<any>;
    deleteRestaurant(req: Request, res: Response): Promise<void>;
    allRestaurants(req: Request, res: Response): Promise<any>;
    findRestaurantById(req: Request, res: Response): Promise<any>;
}
