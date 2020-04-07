import express from 'express';
import { ValidationChain, validationResult } from 'express-validator';

function validate(validations: ValidationChain[]): express.RequestHandler {
    return (req, res, next) => {
        Promise.all(validations.map(validation => validation.run(req))).then(() => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        });
    };
};

export default validate;
