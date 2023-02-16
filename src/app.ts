import 'reflect-metadata';
import dataSource_config from './config/config';
import * as bodyParser from 'body-parser';
import { validationResult } from 'express-validator';
import routes from './router/routes';
import morgan from 'morgan';
import cors from 'cors';
import { createConnection } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import passport from 'passport';
import { GoogleStrategy } from './jwt/google.strategy';
import { FacebookStrategy } from './jwt/facebook.strategy';
import { TwitterStrategy } from './jwt/twitter.strategy';
import express, { Request, Response } from 'express';

ConfigModule.forRoot({
    envFilePath: '.env',
    isGlobal: true,
});
require('dotenv').config({ path: '.env', debug: true });
function handleError(err, req, res) {
    res.status(err.statusCode || 500).send(err.message);
}
let app = express();
app.use(morgan('tiny'));
// app.use(morgan('tiny'));
app.use(bodyParser.json());
// use express json
app.use(express.json());
// use cors
app.use(cors());
passport.use(new FacebookStrategy());
passport.use(new GoogleStrategy());
passport.use(new TwitterStrategy());
app.use(passport.initialize());
// use router
// app.use(router);
const port = 3000;
app.get('/', function (req, res) {
    res.send('hello word');
});

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
                 await new (route.service as any)()[route.action](req, res, next);
            } else {
                const authorization = await new (route.strategy as any)()[route.guard](
                    req,
                    res,
                    next,
                );
                if (authorization.statusMessage === 'Unauthorized') {
                    return authorization;
                }
                await new (route.service as any)()[route.action](req, res, next);
                // res.json({ result, result2 });
            }
        },
    );
});
app.use(handleError);
// export let appDataSource = new DataSource(dataSource_config);
createConnection(dataSource_config)
    .then(async (connection) => {
        console.log('Data base connect successfully');
        app.listen(port, () => {
            console.log(`application running in ${port}`);
        });
    })
    .catch((reason) => {
        console.log('err connecting database', reason);
    });
// })
// .catch((error) => console.log(error));
// appDataSource
//   .connect()
//   .then(() => {
//     console.log('Data base connect successfully');
//
//     app.listen(port, () => {
//       console.log(`application running in ${port}`);
//     });
//   })
//   .catch((reason) => {
//     console.log('err connecting database', reason);
//   });
//
