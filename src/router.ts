import express from 'express';
import { body, query } from 'express-validator';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import path from 'path';
import { Op } from 'sequelize';
import util from 'util';
import mail from './mail';
import authenticate from './middleware/authenticate';
import authorize from './middleware/authorize';
import validate from './middleware/validate';
import Image from './models/Image';
import Post from './models/Post';
import User from './models/User';
import expressAsync from './utils/expressAsync';

const router = express.Router();

router.get('/',
    expressAsync(async (req, res) => {
        const posts = await Post.findAll();

        res.render('index', {
            user: req.user,
            message: req.flash('message'),
            posts,
        });
    }));

router.get('/register',
    expressAsync(async (req, res) => {
        res.render('register');
    }));

router.post('/register',
    validate([
        body('username').isString(),
        body('password').isString(),
        body('email').isEmail().normalizeEmail(),
    ]),
    expressAsync(async (req, res) => {
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    { username: req.body.username },
                    { email: req.body.email },
                ],
            },
        });
        if (existingUser) {
            res.sendStatus(409);
            return;
        }

        const user = await User.create({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            verified: false,
            roles: req.body.username === 'admin'
                ? ['admin', 'moderator']
                : [],
        });

        const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, { expiresIn: '24h' });
        await mail.sendMail({
            from: process.env.SMTP_USERNAME,
            to: user.email,
            subject: 'Verify Email',
            text: `${req.protocol}://${req.headers.host}/verify-email?token=${token}`,
        });

        const login = util.promisify(req.login.bind(req));
        await login(user);

        res.sendStatus(201);
    }));

router.get('/login',
    expressAsync(async (req, res) => {
        res.render('login');
    }));

router.post('/login',
    expressAsync(async (req, res) => {
        const user = await new Promise<false | User>((resolve, reject) => {
            passport.authenticate('local', (err, user) => {
                if (err) return reject(err);
                resolve(user);
            })(req, res);
        });
        if (!user) {
            res.sendStatus(401);
            return;
        };

        const login = util.promisify(req.login.bind(req));
        await login(user);

        res.sendStatus(200);
    }));

router.post('/resend-email-verification',
    authenticate,
    expressAsync(async (req, res) => {
        const user = req.user as User;

        const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, { expiresIn: '24h' });
        await mail.sendMail({
            from: process.env.SMTP_USERNAME,
            to: user.email,
            subject: 'Verify Email',
            text: `${req.protocol}://${req.headers.host}/verify-email?token=${token}`,
        });

        res.sendStatus(200);
    }));

router.get('/verify-email',
    authenticate,
    validate([
        query('token').isJWT(),
    ]),
    expressAsync(async (req, res) => {
        if (!req.query.token) {
            res.sendStatus(401);
            return;
        }

        let payload: any;
        try {
            payload = jwt.verify(req.query.token.toString(), process.env.JWT_SECRET!);
        } catch (err) {
            console.error(err);
            res.sendStatus(401);
            return;
        }

        const id = payload.sub as number;
        await User.update({
            verified: true,
        }, { where: { id }, returning: true });

        req.flash('message', 'Email successfully verified!');
        res.redirect('/');
    }));

router.get('/change-password',
    authenticate,
    expressAsync(async (req, res) => {
        res.render('change-password', {
            user: req.user,
        });
    }));

router.post('/change-password',
    authenticate,
    validate([
        body('currentPassword').isString(),
        body('newPassword').isString(),
    ]),
    expressAsync(async (req, res) => {
        const user = req.user as User;

        const same = await user.comparePassword(req.body.currentPassword);
        if (!same) {
            res.sendStatus(401);
            return;
        }

        await User.update({
            password: req.body.newPassword,
        }, { where: { id: user.id }, returning: true });

        req.flash('message', 'Password successfully changed!');
        res.sendStatus(200);
    }));

router.get('/forgot-password',
    expressAsync(async (req, res) => {
        res.render('forgot-password');
    }));

router.post('/send-password-reset-link',
    validate([
        body('email').isString(),
    ]),
    expressAsync(async (req, res) => {
        const user = await User.findOne({ where: { email: req.body.email, verified: true } });
        if (!user) {
            res.sendStatus(401); // TODO: don't return error because this may open up a possible attack vector
            return;
        }

        const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, { expiresIn: '15m' });
        await mail.sendMail({
            from: process.env.SMTP_USERNAME,
            to: user.email,
            subject: 'Password Reset',
            text: `${req.protocol}://${req.headers.host}/reset-password?token=${token}`,
        });

        req.flash('message', 'Password reset link sent!');
        res.sendStatus(200);
    }));

router.get('/reset-password',
    validate([
        query('token').isJWT(),
    ]),
    expressAsync(async (req, res) => {
        res.render('reset-password');
    }));

router.post('/reset-password',
    validate([
        query('token').isJWT(),
        body('newPassword').isString(),
    ]),
    expressAsync(async (req, res) => {
        if (!req.query.token) {
            res.sendStatus(401);
            return;
        }

        let payload: any;
        try {
            payload = jwt.verify(req.query.token.toString(), process.env.JWT_SECRET!);
        } catch (err) {
            console.error(err);
            res.sendStatus(401);
            return;
        }

        const id = payload.sub as number;
        const [, [user]] = await User.update({
            password: req.body.newPassword,
        }, { where: { id }, returning: true });

        const login = util.promisify(req.login.bind(req));
        await login(user);

        req.flash('message', 'Password successfully reset!');
        res.sendStatus(200);
    }));

router.post('/logout',
    expressAsync(async (req, res) => {
        // req.logout();

        res.sendStatus(200);
    }));

router.get('/posts/:slug',
    expressAsync(async (req, res) => {
        const post = await Post.findOne({ where: { slug: req.params.slug } });
        if (!post) {
            res.sendStatus(404);
            return;
        }

        res.render('post', {
            user: req.user,
            post,
        });
    }));

router.get('/images/:filename',
    expressAsync(async (req, res) => {
        const image = await Image.findOne({ where: { filename: req.params.filename } });
        if (!image) {
            res.sendStatus(404);
            return;
        }

        const data = Buffer.from(image.data.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''), 'base64');

        res.contentType(path.extname(image.filename));
        res.header('Content-Length', data.length.toString());
        res.status(200).send(data);
    }));

router.get('/admin/users',
    authenticate,
    authorize(['admin']),
    expressAsync(async (req, res) => {
        const users = await User.findAll();

        res.render('users', {
            user: req.user,
            users,
        });
    }));

router.put('/admin/users/:id',
    authenticate,
    authorize(['admin']),
    validate([
        body('roles').isArray(),
    ]),
    expressAsync(async (req, res) => {
        const [, [user]] = await User.update({
            roles: req.body.roles,
        }, { where: { id: req.params.id }, returning: true });

        res.status(200).send(user);
    }));

router.delete('/admin/users/:id',
    authenticate,
    authorize(['admin']),
    expressAsync(async (req, res) => {
        await User.destroy({ where: { id: req.params.id } });

        res.sendStatus(200);
    }));

router.get('/admin/new-post',
    authenticate,
    authorize(['admin']),
    expressAsync(async (req, res) => {
        res.render('new-post', {
            user: req.user,
        });
    }));

router.post('/admin/posts',
    authenticate,
    authorize(['admin']),
    validate([
        body('title').isString(),
        body('content').isString(),
    ]),
    expressAsync(async (req, res) => {
        const existingPost = await Post.findOne({ where: { title: req.body.title } });
        if (existingPost) {
            res.sendStatus(409);
            return;
        }

        const post = await Post.create({
            title: req.body.title,
            content: req.body.content,
        });

        res.status(201).send(post);
    }));

router.delete('/admin/posts/:id',
    authenticate,
    authorize(['moderator']),
    expressAsync(async (req, res) => {
        await Post.destroy({ where: { id: req.params.id } });

        res.sendStatus(200);
    }));

router.get('/admin/images',
    authenticate,
    authorize(['admin']),
    expressAsync(async (req, res) => {
        const images = await Image.findAll();

        res.render('images', {
            user: req.user,
            images,
        });
    }));

router.delete('/admin/images/:id',
    authenticate,
    authorize(['admin']),
    expressAsync(async (req, res) => {
        await Image.destroy({ where: { id: req.params.id } });

        res.sendStatus(200);
    }));

router.get('/admin/new-image',
    authenticate,
    authorize(['admin']),
    expressAsync(async (req, res) => {
        res.render('new-image', {
            user: req.user,
        });
    }));

router.post('/admin/images',
    authenticate,
    authorize(['admin']),
    validate([
        body('filename').isString(),
        body('data').isString(),
    ]),
    expressAsync(async (req, res) => {
        const existingImage = await Image.findOne({ where: { filename: req.body.filename } });
        if (existingImage) {
            res.sendStatus(409);
            return;
        }

        const image = await Image.create({
            filename: req.body.filename,
            data: req.body.data,
        });

        res.status(201).send(image);
    }));

export default router;
