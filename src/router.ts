import bcrypt from 'bcrypt';
import express from 'express';
import passport from 'passport';
import Image from './models/Image';
import Post from './models/Post';
import User from './models/User';

const router = express.Router();

const authenticated: express.RequestHandler = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.redirect(`/login?returnurl=${req.protocol}://${req.headers.host}/${req.path}`);
    }
};

router.get('/', (req, res, next) => {
    Post.find((err, posts) => {
        if (err) return next(err);
        res.render('index', {
            user: req.user,
            posts,
        });
    });
});

router.get('/posts/:slug', (req, res, next) => {
    Post.findOne({ slug: req.params.slug }, (err, post) => {
        if (err) return next(err);
        res.render('post', {
            user: req.user,
            post,
        });
    });
});

router.delete('/posts/:id', authenticated, (req, res, next) => {
    Post.deleteOne({ _id: req.params.id }, err => {
        if (err) return next(err);
        res.redirect('/');
    });
});

router.get('/add-post', authenticated, (req, res) => {
    res.render('add-post', {
        user: req.user,
    });
});

router.post('/posts', authenticated, (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        slug: req.body.slug,
        content: req.body.content,
    });
    post.save((err, post) => {
        if (err) return next(err);
        res.redirect(`/posts/${post.slug}`);
    });
});

router.get('/images', authenticated, (req, res, next) => {
    Image.find((err, images) => {
        if (err) return next(err);
        res.render('images', {
            user: req.user,
            images,
        });
    });
});

router.get('/images/:filename', (req, res, next) => {
    Image.findOne({ filename: req.params.filename }, (err, image) => {
        if (err) return next(err);
        if (!image) return res.sendStatus(404);
        const data = Buffer.from(image.data.replace(/^data:image\/png;base64,/, ''), 'base64');
        res.contentType('png');
        res.header('Content-Length', data.length.toString());
        res.status(200).send(data);
    });
});

router.delete('/images/:id', authenticated, (req, res, next) => {
    Image.deleteOne({ _id: req.params.id }, err => {
        if (err) return next(err);
        res.redirect('/images');
    });
});

router.get('/add-image', authenticated, (req, res) => {
    res.render('add-image', {
        user: req.user,
    });
});

router.post('/images', authenticated, (req, res, next) => {
    const image = new Image({
        filename: req.body.filename,
        data: req.body.data,
    });
    image.save((err, image) => {
        if (err) return next(err);
        res.redirect('/');
    });
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/register', (req, res, next) => {
    bcrypt.hash(req.body.password, 12, (err, encrypted) => {
        if (err) return next(err);
        const user = new User({
            username: req.body.username,
            password: encrypted,
        });
        user.save((err, user) => {
            if (err) return next(err);
            req.login(user, err => {
                if (err) return next(err);
                res.redirect(req.query.returnurl || '/');
            });
        });
    });
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user) => {
        if (err) return next(err);
        if (!user) return res.sendStatus(401);
        req.login(user, err => {
            if (err) return next(err);
            res.redirect(req.query.returnurl || '/');
        });
    })(req, res, next);
});

router.post('/logout', (req, res) => {
    req.logout();
    res.redirect(req.query.returnurl || '/');
});

router.use('/brew', (req, res) => {
    res.sendStatus(418);
});

export default router;
