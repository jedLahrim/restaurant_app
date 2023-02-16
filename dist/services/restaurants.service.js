"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const category_entity_1 = require("../models/category.entity");
const restaurant_entity_1 = require("../models/restaurant.entity");
const dishes_entity_1 = require("../models/dishes.entity");
const pagination_1 = require("../commons/pagination");
let RestaurantService = class RestaurantService {
    constructor(restaurants, dishes, category) {
        this.restaurants = restaurants;
        this.dishes = dishes;
        this.category = category;
    }
    async createRestaurant(req, res) {
        const owner = req.user;
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
            await this.restaurants.save(newRestaurant);
            return newRestaurant;
        }
        catch {
            res.send("505").json({ code: "INTERNAL_SERVER_ERR" });
        }
    }
    async _findOrCreateCategory(req) {
        const { category } = req.body;
        if (!category) {
            await this.category.save(this.category.create(category));
        }
        else {
            return category;
        }
    }
    async editRestaurant(req, res) {
        const { categoryName, restaurantId } = req.body;
        const owner = req.user;
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
            let category;
            if (categoryName) {
                category = await this._findOrCreateCategory(req);
            }
            return await this.restaurants.save({
                id: restaurantId,
                ...req.body,
                ...(category && { category }),
            });
        }
        catch {
            return res.send("505").json({ code: "could not edit the restaurant" });
        }
    }
    async deleteRestaurant(req, res) {
        const owner = req.user;
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
        }
        catch {
            res.send("505").json("Could not delete Restaurant");
        }
    }
    async allRestaurants(req, res) {
        const page = req.query;
        try {
            const [restaurants, totalResults] = await this.restaurants.findAndCount({
                skip: (page - 1) * 25,
                take: 25,
                order: { isPromoted: "DESC" },
            });
            return new pagination_1.Pagination(restaurants, totalResults);
        }
        catch {
            res.send("505").json("Could not get restaurants");
        }
    }
    async findRestaurantById(req, res) {
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
        }
        catch {
            res.send("505").json("Could not get restaurant");
        }
    }
    async searchRestaurantByName(req, res) {
        const { restaurantName, page } = req.body;
        try {
            const [restaurants, totalResults] = await this.restaurants.findAndCount({
                where: {
                    name: (0, typeorm_2.Raw)((name) => `${name} LIKE '%${restaurantName}%'`),
                },
                take: 4,
                skip: page - 1,
            });
            return new pagination_1.Pagination(restaurants, totalResults);
        }
        catch {
            res.send("505").json("Could not search for restaurants");
        }
    }
    async allCategories(req, res) {
        return await this.category.find();
    }
    async countRestaurants(req, res) {
        const { restaurantId } = req.body;
        const restaurant = await this.restaurants.findOne({
            where: { id: restaurantId },
        });
        return this.restaurants.count({ where: { id: '' } });
    }
    async myRestaurants(req, res) {
        const owner = req.user;
        try {
            return await this.restaurants.find({ where: { owner } });
        }
        catch {
            res.send("505").json("could not find restaurants");
        }
    }
    async myRestaurant(req, res) {
        try {
            const { id } = req.body;
            const owner = req.user;
            return await this.restaurants.findOne({
                where: { owner, id },
                relations: ["menu", "orders"],
            });
        }
        catch {
            res.send("505").json("Could not find restaurant");
        }
    }
    async createDish(req, res) {
        const { restaurantId, name, price, description } = req.body;
        const owner = req.user;
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
        }
        catch {
            res.send("505").json("Could not create dish");
        }
    }
};
RestaurantService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(restaurant_entity_1.Restaurant)),
    __param(1, (0, typeorm_1.InjectRepository)(dishes_entity_1.Dishes)),
    __param(2, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], RestaurantService);
exports.RestaurantService = RestaurantService;
//# sourceMappingURL=restaurants.service.js.map