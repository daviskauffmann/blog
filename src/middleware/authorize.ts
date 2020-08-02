import User from '../models/User';
import expressAsync from '../utils/expressAsync';

export default function (roles: string[]) {
    return expressAsync(async (req, res) => {
        for (const role of roles) {
            const user = req.user as User;
            if (!user.verified || !user.roles.includes(role)) {
                res.sendStatus(403);
                return;
            }
        }
    });
};
