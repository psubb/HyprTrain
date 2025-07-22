import jwt from 'jsonwebtoken';
import { Response, Request, NextFunction } from 'express';

export function authenticateAccessToken (req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({message: 'Missing or malformed token'});
        return;
    }

    const token = authHeader.split(' ')[1];

    if (!process.env.ACCESS_TOKEN_SECRET) {
        throw new Error('Missing ACCESS_TOKEN_SECRET in environment variable');
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (typeof decoded === 'object' && 'userId' in decoded) {
            req.user = { userId: decoded.userId };
            next();
        } else {
            res.status(401).json({message: 'Invalid token format'});
            return;
        }
    } catch (err) {
        res.status(401).json({message: 'Invalid or expired token'});
        return;
    }
    
}
