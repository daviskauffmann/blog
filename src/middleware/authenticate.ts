import express from 'express';

const authenticate: express.RequestHandler = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.redirect(`/login?returnurl=${req.protocol}://${req.headers.host}${req.path}`);
    }
};

export default authenticate;
