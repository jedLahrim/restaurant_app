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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Restaurant = void 0;
const typeorm_1 = require("typeorm");
const category_entity_1 = require("./category.entity");
const user_entity_1 = require("./user.entity");
const dishes_entity_1 = require("./dishes.entity");
let Restaurant = class Restaurant {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Restaurant.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Restaurant.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Restaurant.prototype, "coverImage", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Restaurant.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Restaurant.prototype, "isPromoted", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)((_type) => category_entity_1.Category, (category) => category.restaurant, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", category_entity_1.Category)
], Restaurant.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)((_type) => user_entity_1.User, (user) => user.restaurant, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", user_entity_1.User)
], Restaurant.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)((_type) => dishes_entity_1.Dishes, (menu) => menu.restaurant, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Array)
], Restaurant.prototype, "menu", void 0);
Restaurant = __decorate([
    (0, typeorm_1.Entity)()
], Restaurant);
exports.Restaurant = Restaurant;
//# sourceMappingURL=restaurant.entity.js.map