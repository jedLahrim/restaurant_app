import express, { Request, Response } from "express";
import { validationResult } from "express-validator";
import routes from "./router/routes";
const app = express();
function handleError(err, req, res) {
  res.status(err.statusCode || 500).send(err.message);
}
routes.forEach((route) => {
  (app as any)[route.method](
    route.route,
    ...route.validation,
    async (req: Request, res: Response, next?: Function) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      console.log(route.strategy);
      console.log(route.guard);
      if (!route.strategy) {
        return await new (route.service as any)()[route.action](req, res, next);
      } else {
        const authorization = await new (route.strategy as any)()[route.guard](
          req,
          res,
          next
        );
        if (authorization.statusMessage === "Unauthorized") {
          return authorization;
        }
        await new (route.service as any)()[route.action](req, res, next);
        // res.json({ result, result2 });
      }
    }
  );
});
app.use(handleError);
app.get("/", (req: Request, res: Response): void => {
  res.json({ message: "Help turkish people!" });
});
const port = 3000;
app.listen(port, () => {
  console.log("Server Running! on port 3000");
});
