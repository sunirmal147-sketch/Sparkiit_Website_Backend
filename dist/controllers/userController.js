"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRole = exports.deleteUser = exports.getAllUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
// GET /api/admin/users
const getAllUsers = async (req, res) => {
    try {
        const users = await User_1.default.find({}).select('-password').sort({ createdAt: -1 });
        res.json({ success: true, data: users, count: users.length });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
exports.getAllUsers = getAllUsers;
// DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.params.id);
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        if (user.role === 'SUPER_ADMIN') {
            res.status(403).json({ success: false, message: 'Cannot delete Super Admin' });
            return;
        }
        await User_1.default.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'User deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
exports.deleteUser = deleteUser;
// PUT /api/admin/users/:id/role
const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!['SUPER_ADMIN', 'ADMIN'].includes(role)) {
            res.status(400).json({ success: false, message: 'Invalid role' });
            return;
        }
        const user = await User_1.default.findByIdAndUpdate(req.params.id, { role }, { new: true, runValidators: true }).select('-password');
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        res.json({ success: true, data: user });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
exports.updateUserRole = updateUserRole;
