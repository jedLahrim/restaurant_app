"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const routes_1 = __importDefault(require("./router/routes"));
const app = (0, express_1.default)();
function handleError(err, req, res) {
    res.status(err.statusCode || 500).send(err.message);
}
routes_1.default.forEach((route) => {
    app[route.method](route.route, ...route.validation, async (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        console.log(route.strategy);
        console.log(route.guard);
        if (!route.strategy) {
            return await new route.service()[route.action](req, res, next);
        }
        else {
            const authorization = await new route.strategy()[route.guard](req, res, next);
            if (authorization.statusMessage === "Unauthorized") {
                return authorization;
            }
            await new route.service()[route.action](req, res, next);
        }
    });
});
app.use(handleError);
app.get("/", (req, res) => {
    res.json({ message: "Help turkish people!" });
});
const port = 3000;
app.listen(port, () => {
    console.log("Server Running! on port 3000");
});
//# sourceMappingURL=app.js.map