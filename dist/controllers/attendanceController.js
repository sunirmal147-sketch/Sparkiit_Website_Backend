"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAttendance = exports.getAllAttendance = exports.logAttendance = void 0;
const Attendance_1 = __importDefault(require("../models/Attendance"));
// Admin: Log attendance
// POST /api/admin/attendance
const logAttendance = async (req, res) => {
    try {
        const { photoUrl, type } = req.body;
        const userId = req.user._id;
        const attendance = await Attendance_1.default.create({
            user: userId,
            photoUrl,
            type: type || 'LOGIN',
            ip: req.ip,
        });
        res.status(201).json({ success: true, data: attendance });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
exports.logAttendance = logAttendance;
// Admin: Get all attendance logs
// GET /api/admin/attendance
const getAllAttendance = async (req, res) => {
    try {
        const logs = await Attendance_1.default.find()
            .populate('user', 'username email')
            .sort({ timestamp: -1 });
        res.json({ success: true, data: logs });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
exports.getAllAttendance = getAllAttendance;
// Admin: Delete attendance log
// DELETE /api/admin/attendance/:id
const deleteAttendance = async (req, res) => {
    try {
        const attendance = await Attendance_1.default.findByIdAndDelete(req.params.id);
        if (!attendance) {
            res.status(404).json({ success: false, message: 'Attendance record not found' });
            return;
        }
        res.json({ success: true, data: {} });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
exports.deleteAttendance = deleteAttendance;
