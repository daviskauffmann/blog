import expressAsync from '../utils/expressAsync';

const authenticate = expressAsync(async (req, res) => {
    if (!req.user) {
        res.redirect(`/login?returnurl=${req.protocol}://${req.headers.host}${req.url}`);
    }
});

export default authenticate;
