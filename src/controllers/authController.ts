import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const generateToken = (id: string, role: string) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};

// POST /api/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (user && (await user.comparePassword(password))) {
            // Check if user is a regular USER (not allowed in CMS)
            if (user.role === 'USER') {
                res.status(403).json({ success: false, message: 'Admins only. Regular users cannot access the CMS portal.' });
                return;
            }

            // Generate token
            const token = generateToken(user._id.toString(), user.role);

            // Store user info in session
            (req.session as any).userId = user._id;
            (req.session as any).role = user.role;

            res.json({
                success: true,
                message: 'Logged in successfully',
                data: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    allowedSections: user.allowedSections,
                    token: token,
                },
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error: any) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error', error });
    }
};

// GET /api/admin/logout
export const logout = async (req: Request, res: Response): Promise<void> => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Could not log out' });
        }
        res.clearCookie('connect.sid'); // Default cookie name
        res.json({ success: true, message: 'Logged out successfully' });
    });
};

// GET /api/admin/me
export const getMe = async (req: Request, res: Response): Promise<void> => {
    if (req.user) {
        res.json({
            success: true,
            data: req.user
        });
    } else {
        res.status(401).json({ success: false, message: 'Not logged in' });
    }
};

// POST /api/auth/register (Protected, Super Admin only can create admins)
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, email, password, role, allowedSections, reportingTo } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400).json({ success: false, message: 'User already exists' });
            return;
        }

        // Only existing Super Admin can create another Super Admin (if singleton is not enforced)
        // User requested only ONE person, so we should probably reject if requester is not Super Admin 
        // AND requested role is Super Admin.
        if (role === 'SUPER_ADMIN' && req.user.role !== 'SUPER_ADMIN') {
            res.status(403).json({ success: false, message: 'Not authorized to create Super Admin' });
            return;
        }

        const user = await User.create({
            username,
            email,
            password,
            role: role || 'ADMIN',
            allowedSections: allowedSections || [],
            reportingTo: reportingTo || undefined,
        });

        res.status(201).json({
            success: true,
            data: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                allowedSections: user.allowedSections,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
