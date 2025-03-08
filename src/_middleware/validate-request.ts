import { Request, Response, NextFunction } from 'express';
import { Schema, ValidationError } from 'joi';

export function validateRequest(req: Request, next: NextFunction, schema: Schema): void {
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true // remove unknown props
    };
    
    const { error, value } = schema.validate(req.body, options);
    
    if (error) {
        const errorMessage = `Validation error: ${error.details.map(x => x.message).join(', ')}`;
        next(errorMessage);
    } else {
        req.body = value;
        next();
    }
}

export function createValidationMiddleware(schema: Schema) {
    return (req: Request, res: Response, next: NextFunction) => {
        validateRequest(req, next, schema);
    };
}

export default validateRequest;