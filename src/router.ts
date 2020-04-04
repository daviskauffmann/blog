import bcrypt from 'bcrypt';
import express from 'express';
import passport from 'passport';
import authenticate from './middleware/authenticate';
import authorize from './middleware/authorize';
import Image from './models/Image';
import Post from './models/Post';
import User from './models/User';

const router = express.Router();

router.get('/', (req, res, next) => {
    Post.find((err, posts) => {
        if (err) return next(err);
        res.render('index', {
            user: req.user,
            posts,
        });
    });
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', (req, res, next) => {
    User.findOne({ username: req.body.username }, (err, user) => {
        if (err) return next(err);
        if (user) return res.sendStatus(409);
        bcrypt.hash(req.body.password, 12, (err, encrypted) => {
            if (err) return next(err);
            const user = new User({
                username: req.body.username,
                email: req.body.email,
                password: encrypted,
                roles: [],
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

router.get('/forgot-password', (req, res) => {
    res.render('forgot-password');
});

router.post('/send-link', (req, res, next) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) return next(err);
        if (!user) return res.sendStatus(400);
        // TODO: send email containing link to /reset-password with jwt in query
        // jwt should contain the user id in sub claim
        // jwt should expire in 15 minutes
        res.redirect('/');
    });
});

router.get('/reset-password', (req, res) => {
    res.render('reset-password');
});

router.post('/reset-password', (req, res) => {
    // TODO: verify jwt from query
    // update user from jwt with password in body
    // login user and redirect to home
    res.sendStatus(501);
});

router.post('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

router.get('/posts/:slug', (req, res, next) => {
    Post.findOne({ slug: req.params.slug }, (err, post) => {
        if (err) return next(err);
        if (!post) return res.sendStatus(404);
        res.render('post', {
            user: req.user,
            post,
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

router.delete('/admin/posts/:id', authenticate, authorize(['admin']), (req, res, next) => {
    Post.deleteOne({ _id: req.params.id }, err => {
        if (err) return next(err);
        res.redirect('/');
    });
});

router.get('/admin/add-post', authenticate, authorize(['admin']), (req, res, next) => {
    res.render('add-post', {
        user: req.user,
    });
});

router.post('/admin/posts', authenticate, authorize(['admin']), (req, res, next) => {
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

router.get('/admin/images', authenticate, authorize(['admin']), (req, res, next) => {
    Image.find((err, images) => {
        if (err) return next(err);
        res.render('images', {
            user: req.user,
            images,
        });
    });
});

router.delete('/admin/images/:id', authenticate, authorize(['admin']), (req, res, next) => {
    Image.deleteOne({ _id: req.params.id }, err => {
        if (err) return next(err);
        res.redirect('/admin/images');
    });
});

router.get('/admin/add-image', authenticate, (req, res, next) => {
    res.render('add-image', {
        user: req.user,
    });
});

router.post('/admin/images', authenticate, (req, res, next) => {
    const image = new Image({
        filename: req.body.filename,
        data: req.body.data,
    });
    image.save((err, image) => {
        if (err) return next(err);
        res.redirect('/admin/images');
    });
});

router.use('/brew', (req, res) => {
    res.sendStatus(418);
});

export default router;
