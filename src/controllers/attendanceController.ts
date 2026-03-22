import { Request, Response } from 'express';
import Attendance from '../models/Attendance';

// Admin: Log attendance
// POST /api/admin/attendance
export const logAttendance = async (req: Request, res: Response): Promise<void> => {
    try {
        const { photoUrl, type } = req.body;
        const userId = (req as any).user._id;

        const attendance = await Attendance.create({
            user: userId,
            photoUrl,
            type: type || 'LOGIN',
            ip: req.ip,
        });

        res.status(201).json({ success: true, data: attendance });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

// Admin: Get all attendance logs
// GET /api/admin/attendance
export const getAllAttendance = async (req: Request, res: Response): Promise<void> => {
    try {
        const logs = await Attendance.find()
            .populate('user', 'username email')
            .sort({ timestamp: -1 });
        
        res.json({ success: true, data: logs });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
// Admin: Delete attendance log
// DELETE /api/admin/attendance/:id
export const deleteAttendance = async (req: Request, res: Response): Promise<void> => {
    try {
        const attendance = await Attendance.findByIdAndDelete(req.params.id);
        
        if (!attendance) {
            res.status(404).json({ success: false, message: 'Attendance record not found' });
            return;
        }

        res.json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
