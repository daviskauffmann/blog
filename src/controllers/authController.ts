import jwt from 'jsonwebtoken';
import passport from 'passport';
import mail from '../mail';
import User from '../models/User';
import expressAsync from '../utils/expressAsync';
import util from 'util';
import { Op } from 'sequelize';

export default {
    registerPage: expressAsync(async (req, res) => {
        res.render('register');
    }),
    register: expressAsync(async (req, res) => {
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
            roles: req.body.username === 'admin' ? ['admin'] : [],
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

        res.sendStatus(200);
    }),
    resendEmailVerification: expressAsync(async (req, res) => {
        const user = req.user as User;
        const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, { expiresIn: '24h' });
        await mail.sendMail({
            from: process.env.SMTP_USERNAME,
            to: user.email,
            subject: 'Verify Email',
            text: `${req.protocol}://${req.headers.host}/verify-email?token=${token}`,
        });

        res.sendStatus(200);
    }),
    verifyEmail: expressAsync(async (req, res) => {
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
    }),
    changePasswordPage: expressAsync(async (req, res) => {
        res.render('change-password', {
            user: req.user,
        });
    }),
    changePassword: expressAsync(async (req, res) => {
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
    }),
    forgotPasswordPage: expressAsync(async (req, res) => {
        res.render('forgot-password');
    }),
    sendPasswordResetLink: expressAsync(async (req, res) => {
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
    }),
    resetPasswordPage: expressAsync(async (req, res) => {
        res.render('reset-password');
    }),
    resetPassword: expressAsync(async (req, res) => {
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
    }),
    logout: expressAsync(async (req, res) => {
        req.logout();

        res.sendStatus(200);
    }),
};
