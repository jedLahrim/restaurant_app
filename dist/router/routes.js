"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const user_service_1 = require("../services/user.service");
const upload_config_1 = require("../upload/upload.config");
const jwt_strategy_1 = require("../jwt/jwt.strategy");
const passport_1 = __importDefault(require("passport"));
const restaurants_service_1 = require("../services/restaurants.service");
const routes = [
    {
        method: "get",
        route: "/users",
        service: user_service_1.UserService,
        action: "getAll",
        validation: [],
    },
    {
        method: "get",
        route: "/users/:id",
        service: user_service_1.UserService,
        action: "findOne",
        validation: [(0, express_validator_1.param)("id").isString()],
    },
    {
        method: "post",
        route: "/users",
        service: user_service_1.UserService,
        action: "register",
        validation: [
            (0, express_validator_1.body)("first_name").isString().withMessage("invalid value of first name"),
            (0, express_validator_1.body)("last_name").isString().withMessage("invalid value of last name"),
            (0, express_validator_1.body)("email")
                .matches(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/gm)
                .withMessage("email must contain a valid email address")
                .isEmail()
                .withMessage("email must contain a valid email address"),
            (0, express_validator_1.body)("password").isString().withMessage("invalid value of password"),
        ],
    },
    {
        method: "post",
        route: "/users/uploads",
        strategy: jwt_strategy_1.JwtStrategy,
        service: user_service_1.UserService,
        action: "uploadFile",
        guard: "authGuard",
        validation: [(0, express_validator_1.body)("file"), upload_config_1.upload.single("file")],
    },
    {
        method: "post",
        route: "/users/upload",
        strategy: jwt_strategy_1.JwtStrategy,
        service: user_service_1.UserService,
        action: "upload",
        guard: "authGuard",
        validation: [(0, express_validator_1.body)("file"), upload_config_1.upload.single("file")],
    },
    {
        method: "delete",
        route: "/users/:id",
        strategy: jwt_strategy_1.JwtStrategy,
        service: user_service_1.UserService,
        action: "remove",
        guard: "authGuard",
        validation: [(0, express_validator_1.param)("id")],
    },
    {
        method: "post",
        route: "/login",
        service: user_service_1.UserService,
        action: "login",
        validation: [
            (0, express_validator_1.body)("email").isString(),
            (0, express_validator_1.body)("password").isString(),
        ],
    },
    {
        method: "get",
        route: "/user/facebook",
        service: user_service_1.UserService,
        action: "loginWithFacebook",
        validation: [passport_1.default.authenticate("facebook")],
    },
    {
        method: "get",
        route: "/user/facebook/callback",
        service: user_service_1.UserService,
        action: "callback",
        validation: [],
    },
    {
        method: "get",
        route: "/user/google",
        service: user_service_1.UserService,
        action: "loginWithGoogle",
        validation: [passport_1.default.authenticate("google")],
    },
    {
        method: "get",
        route: "/user/google/callback",
        service: user_service_1.UserService,
        action: "callbacks",
        validation: [],
    },
    {
        method: "get",
        route: "/user/twitter",
        service: user_service_1.UserService,
        action: "loginWithTwitter",
        validation: [passport_1.default.authenticate("twitter")],
    },
    {
        method: "get",
        route: "/user/twitter/callback",
        service: user_service_1.UserService,
        action: "twitterCallback",
        validation: [],
    },
    {
        method: "get",
        route: "/user/getCodeQR",
        service: user_service_1.UserService,
        action: "generateQRCode",
        validation: [],
    },
    {
        method: "post",
        route: "/restaurants/create",
        service: restaurants_service_1.RestaurantService,
        action: "createRestaurant",
        validation: [],
    },
];
exports.default = routes;
//# sourceMappingURL=routes.js.map