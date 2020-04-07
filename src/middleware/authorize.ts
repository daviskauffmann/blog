import express from 'express';
import User from '../models/User';

function authorize(roles: string[]): express.RequestHandler {
    return function (req, res, next) {
        for (const role of roles) {
            if (!(req.user as User).roles.includes(role)) {
                return res.sendStatus(403);
            }
        }
        next();
    };
};

export default authorize;
