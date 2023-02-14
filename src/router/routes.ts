import { body, param, query } from "express-validator";
import { UserService } from "../services/user.service";
import { upload } from "../upload/upload.config";
import { JwtStrategy } from "../jwt/jwt.strategy";
import passport from "passport";
import {Restaurant} from "../models/restaurant.entity";
import {RestaurantService} from "../services/restaurants.service";
const routes = [
  {
    method: "get",
    route: "/users",
    service: UserService,
    action: "getAll",
    validation: [],
  },
  {
    method: "get",
    route: "/users/:id",
    service: UserService,
    action: "findOne",
    validation: [param("id").isString()],
  },

  {
    method: "post",
    route: "/users",
    service: UserService,
    action: "register",
    validation: [
      body("first_name").isString().withMessage("invalid value of first name"),
      body("last_name").isString().withMessage("invalid value of last name"),
      body("email")
        .matches(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/gm)
        .withMessage("email must contain a valid email address")
        .isEmail()
        .withMessage("email must contain a valid email address"),
      body("password").isString().withMessage("invalid value of password"),
    ],
  },
  {
    method: "post",
    route: "/users/uploads",
    strategy: JwtStrategy,
    service: UserService,
    action: "uploadFile",
    guard: "authGuard",
    validation: [body("file"), upload.single("file")],
  },
  {
    method: "post",
    route: "/users/upload",
    strategy: JwtStrategy,
    service: UserService,
    action: "upload",
    guard: "authGuard",
    validation: [body("file"), upload.single("file")],
  },
  {
    method: "delete",
    route: "/users/:id",
    strategy: JwtStrategy,
    service: UserService,
    action: "remove",
    guard: "authGuard",
    validation: [param("id")],
  },
  {
    method: "post",
    route: "/login",
    service: UserService,
    action: "login",
    validation: [
      body("email").isString(),
      body("password").isString(),
      // passport.authenticate('Jwt', { session: false }),
    ],
  },
  {
    method: "get",
    route: "/user/facebook",
    service: UserService,
    action: "loginWithFacebook",
    validation: [passport.authenticate("facebook")],
  },
  {
    method: "get",
    route: "/user/facebook/callback",
    service: UserService,
    action: "callback",
    validation: [],
  },
  {
    method: "get",
    route: "/user/google",
    service: UserService,
    action: "loginWithGoogle",
    validation: [passport.authenticate("google")],
  },
  {
    method: "get",
    route: "/user/google/callback",
    service: UserService,
    action: "callbacks",
    validation: [],
  },
  {
    method: "get",
    route: "/user/twitter",
    service: UserService,
    action: "loginWithTwitter",
    validation: [passport.authenticate("twitter")],
  },
  {
    method: "get",
    route: "/user/twitter/callback",
    service: UserService,
    action: "twitterCallback",
    validation: [],
  },
  {
    method: "get",
    route: "/user/getCodeQR",
    service: UserService,
    action: "generateQRCode",
    validation: [],
  },
  {
    method: "post",
    route: "/restaurants/create",
    service: RestaurantService,
    action: "createRestaurant",
    validation: [],
  },
];
export default routes;
