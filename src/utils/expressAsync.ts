import express from 'express';

export default function (fn: (req: express.Request, res: express.Response) => Promise<void>): express.RequestHandler {
    return function (req, res, next) {
        fn(req, res)
            .then(() => {
                if (!res.headersSent) {
                    return next();
                }
            })
            .catch(next);
    };
}
