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
export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
    try {
        const { role } = req.body;
        if (!['SUPER_ADMIN', 'ADMIN'].includes(role)) {
            res.status(400).json({ success: false, message: 'Invalid role' });
            return;
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
