import bcrypt from 'bcrypt';
import express from 'express';
import User from './models/User';
import passport from 'passport';

const router = express.Router();

const authenticated: express.RequestHandler = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

router.get('/', (req, res) => {
    res.render('index', {
        user: req.user,
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
            passwordHash: encrypted,
        });
        user.save((err, user) => {
            if (err) return next(err);
            req.login(user, err => {
                if (err) return next(err);
                res.redirect('/');
            });
        });
    });
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
}));

router.post('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

router.use('/brew', (req, res) => {
    res.sendStatus(418);
});

export default router;
