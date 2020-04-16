import User from '../models/User';
import expressAsync from '../utils/expressAsync';

function authorize(roles: string[]) {
    return expressAsync(async (req, res) => {
        for (const role of roles) {
            if (!(req.user as User).roles.includes(role)) {
                res.sendStatus(403);
                return;
            }
        }
    });
};

export default authorize;
