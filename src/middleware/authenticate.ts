import express from 'express';

const authenticate: express.RequestHandler = (req, res, next) => {
    if (!req.user) {
        return res.redirect(`/login?returnurl=${req.protocol}://${req.headers.host}${req.path}`);
    }
    next();
};

export default authenticate;
