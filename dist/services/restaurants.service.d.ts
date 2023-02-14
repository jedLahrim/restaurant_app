import { Repository } from "typeorm";
import { Category } from "../models/category.entity";
import { Request, Response } from "express";
import { Restaurant } from "../models/restaurant.entity";
import { Dishes } from "../models/dishes.entity";
import { Pagination } from "../commons/pagination";
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
    searchRestaurantByName(req: Request, res: Response): Promise<Pagination<Restaurant>>;
    allCategories(req: any, res: any): Promise<Category[]>;
    countRestaurants(req: Request, res: Response): Promise<number>;
    myRestaurants(req: Request, res: Response): Promise<Restaurant[]>;
    myRestaurant(req: Request, res: Response): Promise<Restaurant>;
    createDish(req: Request, res: Response): Promise<Dishes>;
}
