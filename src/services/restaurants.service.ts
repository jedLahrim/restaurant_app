import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { getRepository, Raw, Repository } from "typeorm";
import { Category } from "../models/category.entity";
import { Request, Response } from "express";
import { Restaurant } from "../models/restaurant.entity";
import { Dishes } from "../models/dishes.entity";
import { Pagination } from "../commons/pagination";
import { User } from "../models/user.entity";

@Injectable()
export class RestaurantService {
  private userRepo = getRepository<User>(User);
  private readonly restaurants = getRepository<Restaurant>(Restaurant);
  private readonly dishes = getRepository<Dishes>(Dishes);
  private readonly category = getRepository<Category>(Category);

  async createRestaurant(req: Request, res: Response) {
    const userObject: any = req.user;
    const user = await this.userRepo.findOne({
      where: { email: userObject.email },
    });
    let { isPromoted, address, coverImage, name } = req.body;
    try {
      const newRestaurant = this.restaurants.create({
        address,
        coverImage,
        name,
        isPromoted: isPromoted,
        owner: user,
      });
      // category = await this._findOrCreateCategory(req);
      // newRestaurant.category = category;
      await this.restaurants.save({
        address,
        coverImage,
        name,
        isPromoted: isPromoted,
      });
      res.json(newRestaurant);
    } catch {
      res.json({ code: "INTERNAL_SERVER_ERR" });
    }
  }

  async _findOrCreateCategory(req) {
    const { category } = req.body;
    if (!category) {
      await this.category.save(this.category.create(category));
    } else {
      return category;
    }
  }

  async editRestaurant(req: Request, res: Response) {
    const userObject: any = req.user;
    const owner: any = await this.userRepo.findOne({
      where: { email: userObject.email },
    });
    const { categoryName, restaurantId } = req.body;
    const restaurant = await this.restaurants.findOne({
      where: { id: restaurantId },
      loadRelationIds: true,
    });
    try {
      if (!restaurant) {
        res.status(404).json({ code: "Restaurant not found" });
      }
      if (owner.id !== restaurant.owner) {
        return res
          .send("405")
          .json({ code: "You can't edit a restaurant you don't own" });
      }

      // let category: Category;
      // if (categoryName) {
      //   category = await this._findOrCreateCategory(req);
      // }

      const newRestaurant = await this.restaurants.save({
        id: restaurantId,
        ...req.body,
        owner: owner,
        // ...(category && { category }),
      });
      res.json(newRestaurant);
    } catch {
      res.json({ code: "could not edit the restaurant" });
    }
  }

  async deleteRestaurant(req: Request, res: Response): Promise<void> {
    const userObject: any = req.user;
    const owner: any = await this.userRepo.findOne({
      where: { email: userObject.email },
    });
    const { id } = req.params;
    const restaurant = await this.restaurants.findOne({
      where: { id: id },
      loadRelationIds: true,
    });
    try {
      if (!restaurant) {
        res.send("405").json({ code: "Restaurant not found" });
      }

      if (owner.id !== restaurant.owner) {
        res.send("405").json("You can't delete a restaurant you don't own");
      }
      await this.restaurants.delete({ id: id });
      res.json();
    } catch {
      res.send("505").json("Could not delete Restaurant");
    }
  }
  //
  async allRestaurants(req: Request, res: Response) {
    const query: any = req.query;
    try {
      const [restaurants, totalResults] = await this.restaurants.findAndCount({
        skip: query.skip,
        take: query.page,
        order: { isPromoted: "DESC" },
      });
      res.json(new Pagination<Restaurant>(restaurants, totalResults));
    } catch {
      res.send("505").json("Could not get restaurants");
    }
  }

  async findRestaurantById(req: Request, res: Response): Promise<any> {
    const { restaurantId } = req.params;
    try {
      const restaurant = await this.restaurants.findOne({
        where: { id: restaurantId },
        relations: ["menu"],
      });
      if (!restaurant) {
        res.send("404").json("Restaurant not found");
      }
      return { ok: true, restaurant };
    } catch {
      res.send("505").json("Could not get restaurant");
    }
  }
  
  async searchRestaurantByName(req: Request, res: Response): Promise<void> {
    const query: any = req.query;
    const { restaurantName, page, coverImageDto } = query;
    try {
      const [restaurants, totalResults] = await this.restaurants.findAndCount({
        where: {
          coverImage: Raw(
            (coverImage) => `${coverImage} LIKE '%${coverImageDto}%'`
          ),
          name: Raw((name) => `${name} LIKE '%${restaurantName}%'`),
        },
        take: 4,
        skip: (page - 1) * 4,
      });
      res.json(new Pagination<Restaurant>(restaurants, totalResults));
    } catch (e) {
      console.log(e)
      res.send("505").json("Could not search for restaurants");
    }
    }
  //
  async allCategories(req, res): Promise<Category[]> {
    return await this.category.find();
  }
  //
  async countRestaurants(req: Request, res: Response): Promise<number> {
    const { restaurantId } = req.body;
    const restaurant = await this.restaurants.findOne({
      where: { id: restaurantId },
    });
    return this.restaurants.count({ where: { id: "" } });
  }

  async myRestaurants(req: Request, res: Response): Promise<Restaurant[]> {
    const owner = req.user;
    try {
      return await this.restaurants.find({ where: { owner } });
    } catch {
      res.send("505").json("could not find restaurants");
    }
  }
  async myRestaurant(req: Request, res: Response): Promise<Restaurant> {
    try {
      const { id } = req.body;
      const owner = req.user;
      return await this.restaurants.findOne({
        where: { owner, id },
        relations: ["menu", "orders"],
      });
    } catch {
      res.send("505").json("Could not find restaurant");
    }
  }
  //
  // async findCategoryBySlug({
  //   slug,
  //   page,
  // }: CategoryInput): Promise<CategoryOutput> {
  //   try {
  //     const category = await this.categories.findOne({ slug });
  //     if (!category) {
  //       return {
  //         ok: false,
  //         error: "Category not found",
  //       };
  //     }
  //     const restaurants = await this.restaurants.find({
  //       where: {
  //         category,
  //       },
  //       order: {
  //         isPromoted: "DESC",
  //       },
  //       take: 25,
  //       skip: (page - 1) * 25,
  //     });
  //     const totalResults = await this.countRestaurants(category);
  //     return {
  //       ok: true,
  //       restaurants,
  //       category,
  //       totalPages: Math.ceil(totalResults / 25),
  //     };
  //   } catch {
  //     return {
  //       ok: false,
  //       error: "Could not load category",
  //     };
  //   }
  // }
  //
  async createDish(req: Request, res: Response): Promise<Dishes> {
    const { restaurantId, name, price, description } = req.body;
    const owner: any = req.user;
    try {
      const restaurant = await this.restaurants.findOne({
        where: { id: restaurantId },
      });
      if (!restaurant) {
        res.send("405").json("Restaurant not found");
      }
      if (owner.id !== restaurant.owner.id) {
        res
          .send("505")
          .json("You can't add dish to another owner's restaurant");
      }
      const dishes = await this.dishes.create({ price, name, description });
      return await this.dishes.save(dishes);
    } catch {
      res.send("505").json("Could not create dish");
    }
  }
  //
  // async editDish(
  //   owner: User,
  //   editDishInput: EditDishInput
  // ): Promise<EditDishOutput> {
  //   try {
  //     const dish = await this.dishes.findOne(editDishInput.dishId, {
  //       relations: ["restaurant"],
  //     });
  //     if (!dish) {
  //       return {
  //         ok: false,
  //         error: "Dish not found",
  //       };
  //     }
  //     if (dish.restaurant.ownerId !== owner.id) {
  //       return { ok: false, error: "You can't do that" };
  //     }
  //     await this.dishes.save([{ id: editDishInput.dishId, ...editDishInput }]);
  //     return { ok: true };
  //   } catch {
  //     return { ok: false, error: "Cannot edit dish" };
  //   }
  // }
  //
  // async deleteDish(
  //   owner: User,
  //   deleteDishInput: DeleteDishInput
  // ): Promise<DeleteDishOutput> {
  //   try {
  //     const dish = await this.dishes.findOne(deleteDishInput.dishId, {
  //       relations: ["restaurant"],
  //     });
  //     if (!dish) {
  //       return {
  //         ok: false,
  //         error: "Dish not found",
  //       };
  //     }
  //     if (dish.restaurant.ownerId !== owner.id) {
  //       return { ok: false, error: "You can't do that" };
  //     }
  //     await this.dishes.delete(dish.id);
  //     return { ok: true };
  //   } catch {
  //     return { ok: false, error: "Cannot delete dish" };
  //   }
  // }
}
