import jwt from 'jsonwebtoken';
import { Response, Request, NextFunction } from 'express';

// Extends the request to allow for optional userdata along with it
interface AuthenticatedRequest extends Request {
    user?: { userId: string };
}

export function authenticateAccessToken (req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({message: 'Missing or malformed token'});
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
            return res.status(401).json({message: 'Invalid token format'});
        }
    } catch (err) {
        return res.status(401).json({message: 'Invalid or expired token'});
    }
    
}
