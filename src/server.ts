import connectMongodbSession from 'connect-mongodb-session';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';
import passport from 'passport';
import './passport';
import router from './router';

const MongoDBStore = connectMongodbSession(session);
const store = new MongoDBStore({
    uri: process.env.MONGODB_URI!,
    collection: 'sessions',
});

const app = express();

app.set('view engine', 'ejs');

app.use(morgan('dev'));

app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        secure: process.env.NODE_ENV === 'production',
    },
    store,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(router);

if (process.env.NODE_ENV === 'production') {
    app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.error(err);
        res.status(500).send({
            name: err.name,
            message: err.message,
        });
    });
} else {
    app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.error(err);
        res.status(500).send({
            name: err.name,
            message: err.message,
            stack: err.stack,
        });
    });
}

mongoose.connect(process.env.MONGODB_URI!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}, err => {
    if (err) throw err;
    console.log(`Connected to ${process.env.MONGODB_URI}`);
    app.listen(process.env.PORT, () => {
        console.log(`Server listening on port ${process.env.PORT}`);
    });
});
