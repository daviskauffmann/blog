import User from '../models/User';
import expressAsync from '../utils/expressAsync';

export default function (roles: string[]) {
    return expressAsync(async (req, res) => {
        const user = req.user as User;

        if (!user.verified) {
            res.sendStatus(403);
            return;
        }

        for (const role of roles) {
            if (!user.roles.includes(role)) {
                res.sendStatus(403);
                return;
            }
        }
    });
};
