import bcrypt from 'bcrypt';
import express from 'express';
import passport from 'passport';
import Image from './models/Image';
import Post from './models/Post';
import User from './models/User';

const router = express.Router();

const authenticate: express.RequestHandler = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.redirect(`/login?returnurl=${req.protocol}://${req.headers.host}${req.path}`);
    }
};

router.get('/', (req, res, next) => {
    User.find((err, users) => {
        if (err) return next(err);
        res.render('index', {
            user: req.user,
            users,
        });
    });
});

router.get('/register', (req, res) => {
    res.render('register');
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

router.get('/login', (req, res) => {
    res.render('login');
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

router.get('/:username/posts', (req, res, next) => {
    User.findOne({ username: req.params.username }, (err, user) => {
        if (err) return next(err);
        if (!user) return res.sendStatus(404);
        Post.find({ userId: user.id }, (err, posts) => {
            res.render('posts', {
                user: req.user,
                username: user.username,
                posts,
            });
        });
    });
});

router.get('/:username/posts/:slug', (req, res, next) => {
    User.findOne({ username: req.params.username }, (err, user) => {
        if (err) return next(err);
        if (!user) return res.sendStatus(404);
        Post.findOne({ userId: user.id, slug: req.params.slug }, (err, post) => {
            if (err) return next(err);
            if (!post) return res.sendStatus(404);
            res.render('post', {
                user: req.user,
                username: user.username,
                post,
            });
        });
    });
});

router.get('/:username/images/:filename', (req, res, next) => {
    Image.findOne({ filename: req.params.filename }, (err, image) => {
        if (err) return next(err);
        if (!image) return res.sendStatus(404);
        const data = Buffer.from(image.data.replace(/^data:image\/png;base64,/, ''), 'base64');
        res.contentType('png');
        res.header('Content-Length', data.length.toString());
        res.status(200).send(data);
    });
});

router.delete('/admin/posts/:id', authenticate, (req, res, next) => {
    Post.findOne({ _id: req.params.id }, (err, post) => {
        if (err) return next(err);
        if (!post) return res.sendStatus(404);
        if (!post.userId.equals((req.user as User).id)) return res.sendStatus(403);
        Post.deleteOne({ _id: req.params.id }, err => {
            if (err) return next(err);
            res.redirect(`/${(req.user as User).username}/posts`);
        });
    });
});

router.get('/admin/add-post', authenticate, (req, res, next) => {
    res.render('add-post', {
        user: req.user,
    });
});

router.post('/admin/posts', authenticate, (req, res, next) => {
    const post = new Post({
        userId: (req.user as User).id,
        title: req.body.title,
        slug: req.body.slug,
        content: req.body.content,
    });
    post.save((err, post) => {
        if (err) return next(err);
        res.redirect(`/${(req.user as User).username}/posts/${post.slug}`);
    });
});

router.get('/admin/images', authenticate, (req, res, next) => {
    Image.find({ userId: (req.user as User).id }, (err, images) => {
        if (err) return next(err);
        res.render('images', {
            user: req.user,
            images,
        });
    });
});

router.delete('/admin/images/:id', authenticate, (req, res, next) => {
    Image.findOne({ _id: req.params.id }, (err, image) => {
        if (err) return next(err);
        if (!image) return res.sendStatus(404);
        if (!image.userId.equals((req.user as User).id)) return res.sendStatus(403);
        Image.deleteOne({ _id: req.params.id }, err => {
            if (err) return next(err);
            res.redirect(`/admin/images`);
        });
    });
});

router.get('/admin/add-image', authenticate, (req, res, next) => {
    res.render('add-image', {
        user: req.user,
    });
});

router.post('/admin/images', authenticate, (req, res, next) => {
    const image = new Image({
        userId: (req.user as User).id,
        filename: req.body.filename,
        data: req.body.data,
    });
    image.save((err, image) => {
        if (err) return next(err);
        res.redirect(`/admin/images`);
    });
});

router.use('/brew', (req, res) => {
    res.sendStatus(418);
});

export default router;
