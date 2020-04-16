import jwt from 'jsonwebtoken';
import passport from 'passport';
import mail from '../mail';
import User from '../models/User';
import expressAsync from '../utils/expressAsync';
import util from 'util';

export default {
    registerPage: expressAsync(async (req, res) => {
        res.render('register');
    }),
    register: expressAsync(async (req, res) => {
        const existingUser = await User.findOne({ where: { username: req.body.username } });
        if (existingUser) {
            res.sendStatus(409);
            return;
        }

        const user = await User.create({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            roles: req.body.username === 'admin' ? ['admin'] : [],
        });

        const login = util.promisify(req.login.bind(req));
        await login(user);

        res.redirect(req.query.returnurl || '/');
    }),
    loginPage: expressAsync(async (req, res) => {
        res.render('login');
    }),
    login: expressAsync(async (req, res) => {
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

        res.redirect(req.query.returnurl || '/');
    }),
    forgotPasswordPage: expressAsync(async (req, res) => {
        res.render('forgot-password');
    }),
    sendLink: expressAsync(async (req, res) => {
        const user = await User.findOne({ where: { username: req.body.username } });
        if (!user) {
            res.sendStatus(400);
            return;
        }

        const token = jwt.sign({ sub: user.username }, process.env.JWT_SECRET!, { expiresIn: '15m' });
        await mail.sendMail({
            from: process.env.NODEMAILER_USERNAME,
            to: user.email,
            subject: 'Password Reset',
            text: `${req.protocol}://${req.hostname}:${process.env.PORT}/reset-password?token=${token}`,
        });

        res.redirect('/');
    }),
    resetPasswordPage: expressAsync(async (req, res) => {
        res.render('reset-password');
    }),
    resetPassword: expressAsync(async (req, res) => {
        let payload: any;
        try {
            payload = jwt.verify(req.query.token, process.env.JWT_SECRET!);
        } catch (err) {
            console.error(err);
            res.sendStatus(401);
            return;
        }

        const username: string = payload.sub;
        const [, [user]] = await User.update({
            password: req.body.password,
        }, { where: { username }, returning: true });

        const login = util.promisify(req.login.bind(req));
        await login(user);

        res.redirect('/');
    }),
    logout: expressAsync(async (req, res) => {
        req.logout();

        res.redirect('/');
    }),
};
