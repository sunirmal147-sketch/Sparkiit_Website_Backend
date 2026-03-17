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
    const session = req.session as any;

    if (session && session.userId) {
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
        } catch (error) {
            res.status(401).json({ success: false, message: 'Not authorized, session failed' });
        }
    } else {
        res.status(401).json({ success: false, message: 'Not authorized, please login' });
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
