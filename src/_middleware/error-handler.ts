import { Request, Response, NextFunction } from 'express';

function errorHandler(err: Error | string, req: Request, res: Response, next: NextFunction): void {
    switch (true) {
        case typeof err === 'string':
            // custom application error
            const is404 = (err as string).toLowerCase().endsWith('not found');
            const statusCode = is404 ? 404 : 400;
            res.status(statusCode).json({ message: err });
            break;
        default:
            res.status(500).json({ message: err instanceof Error ? err.message : 'Unknown error occurred' });
    }
}

module.exports = {
    errorHandler
};