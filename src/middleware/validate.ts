import { ValidationChain, validationResult } from 'express-validator';
import expressAsync from '../utils/expressAsync';

function validate(validations: ValidationChain[]) {
    return expressAsync(async (req, res) => {
        await Promise.all(validations.map(validation => validation.run(req)));
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }
    })
};

export default validate;
