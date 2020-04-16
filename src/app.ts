import connectRedis from 'connect-redis';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from './passport';
import redisClient from './redisClient';
import router from './router';

const RedisStore = connectRedis(session);

const app = express();

app.set('view engine', 'ejs');

app.use(morgan('dev'));

app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET!,
    store: new RedisStore({ client: redisClient }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    },
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(router);

app.use(express.static('public'));

if (process.env.NODE_ENV === 'production') {
    app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.error(err);
        if (res.headersSent) {
            next(err);
        } else {
            res.status(500).send({
                name: err.name,
                message: err.message,
            });
        }
    });
} else {
    app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.error(err);
        if (res.headersSent) {
            next(err);
        } else {
            res.status(500).send({
                name: err.name,
                message: err.message,
                stack: err.stack,
            });
        }
    });
}

export default app;
