import User from '../models/User';
import expressAsync from '../utils/expressAsync';

function authorize(roles: string[]) {
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

export default authorize;
