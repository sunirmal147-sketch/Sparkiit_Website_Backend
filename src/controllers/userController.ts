import { Request, Response } from 'express';
import User from '../models/User';

// GET /api/admin/users
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json({ success: true, data: users, count: users.length });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

// DELETE /api/admin/users/:id
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

        if (user.role === 'SUPER_ADMIN') {
            res.status(403).json({ success: false, message: 'Cannot delete Super Admin' });
            return;
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

// PUT /api/admin/users/:id/role
// Notice: We keep the route name but we'll use it to update role, allowedSections, and reportingTo
export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
    try {
        const { role, allowedSections, password, reportingTo } = req.body;
        
        const validRoles = ['SUPER_ADMIN', 'ADMIN', 'HR', 'TEAM_LEADER', 'MANAGER', 'BDE', 'BDA', 'USER'];
        if (role && !validRoles.includes(role)) {
            res.status(400).json({ success: false, message: 'Invalid role' });
            return;
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

        if (role) user.role = role;
        if (allowedSections !== undefined) user.allowedSections = allowedSections;
        if (password) user.password = password;
        if (reportingTo !== undefined) {
            user.reportingTo = reportingTo === '' || reportingTo === null ? undefined : reportingTo;
        }

        await user.save();
        
        // Remove password from response
        const userObj = user.toObject() as any;
        delete userObj.password;

        res.json({ success: true, data: userObj });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
