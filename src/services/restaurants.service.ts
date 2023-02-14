import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Raw, Repository } from "typeorm";
import { Category } from "../entities/category.entity";
import { Request, Response } from "express";
import { Restaurant } from "../entities/restaurant.entity";
import { Dishes } from "../entities/dishes.entity";
import { Pagination } from "../commons/pagination";

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
    @InjectRepository(Dishes)
    private readonly dishes: Repository<Dishes>,
    @InjectRepository(Category)
    private readonly category: Repository<Category>
  ) {}

  async createRestaurant(req: Request, res: Response): Promise<Restaurant> {
    const owner: any = req.user;
    let { menu, category, address, coverImage, name } = req.body;
    try {
      const newRestaurant = this.restaurants.create({
        menu,
        address,
        coverImage,
        name,
      });
      newRestaurant.owner = owner;
      category = await this._findOrCreateCategory(req);
      newRestaurant.category = category;
      await this.restaurants.save(newRestaurant);
      return newRestaurant;
    } catch {
      res.send("505").json({ code: "INTERNAL_SERVER_ERR" });
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
    const { categoryName, restaurantId } = req.body;
    const owner: any = req.user;
    const restaurant = await this.restaurants.findOne({
      where: { id: restaurantId },
      loadRelationIds: true,
    });
    try {
      if (!restaurant) {
        return { ok: false, error: "Restaurant not found" };
      }

      if (owner.id !== restaurant.owner.id) {
        return res
          .send("405")
          .json({ code: "You can't edit a restaurant you don't own" });
      }

      let category: Category;
      if (categoryName) {
        category = await this._findOrCreateCategory(req);
      }

      return await this.restaurants.save({
        id: restaurantId,
        ...req.body,
        ...(category && { category }),
      });
    } catch {
      return res.send("505").json({ code: "could not edit the restaurant" });
    }
  }

  async deleteRestaurant(req: Request, res: Response): Promise<void> {
    const owner: any = req.user;
    const { restaurantId } = req.body;
    const restaurant = await this.restaurants.findOne({
      where: { id: restaurantId },
      loadRelationIds: true,
    });
    try {
      if (!restaurant) {
        res.send("405").json({ code: "Restaurant not found" });
      }

      if (owner.id !== restaurant.owner.id) {
        res.send("405").json("You can't delete a restaurant you don't own");
      }
      await this.restaurants.delete({ id: restaurantId });
    } catch {
      res.send("505").json("Could not delete Restaurant");
    }
  }
  //
  async allRestaurants(req: Request, res: Response): Promise<any> {
    const page: any = req.query;
    try {
      const [restaurants, totalResults] = await this.restaurants.findAndCount({
        skip: (page - 1) * 25,
        take: 25,
        order: { isPromoted: "DESC" },
      });
      return new Pagination<Restaurant>(restaurants, totalResults);
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
  //
  async searchRestaurantByName(
    req: Request,
    res: Response
  ): Promise<Pagination<Restaurant>> {
    const { restaurantName, page } = req.body;
    try {
      const [restaurants, totalResults] = await this.restaurants.findAndCount({
        where: {
          name: Raw((name) => `${name} LIKE '%${restaurantName}%'`),
        },
        take: 4,
        skip: page - 1,
      });
      return new Pagination<Restaurant>(restaurants, totalResults);
    } catch {
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
    return this.restaurants.count({ where: { category: restaurant.category } });
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
