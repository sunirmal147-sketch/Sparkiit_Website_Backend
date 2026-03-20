import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Candidate from '../models/Candidate';

interface DecodedToken {
    id: string;
    role: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    const session = req.session as any;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as DecodedToken;
            
            if (decoded.role === 'CANDIDATE') {
                req.user = await Candidate.findById(decoded.id).select('-password');
            } else {
                req.user = await User.findById(decoded.id).select('-password');
            }
            
            if (!req.user) {
                res.status(401).json({ success: false, message: 'Not authorized, user not found' });
                return;
            }
            next();
            return;
        } catch (error) {
            res.status(401).json({ success: false, message: 'Not authorized, token failed' });
            return;
        }
    } else if (session && session.userId) {
        try {
            if (session.role === 'CANDIDATE') {
                req.user = await Candidate.findById(session.userId).select('-password');
            } else {
                req.user = await User.findById(session.userId).select('-password');
            }
            
            if (!req.user) {
                res.status(401).json({ success: false, message: 'Not authorized, user not found' });
                return;
            }
            next();
            return;
        } catch (error) {
            res.status(401).json({ success: false, message: 'Not authorized, session failed' });
            return;
        }
    } else {
        res.status(401).json({ success: false, message: 'Not authorized, please login' });
        return;
    }
};

export const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({ success: false, message: `Role ${req.user?.role} is not authorized to access this route` });
            return;
        }
        next();
    };
};
