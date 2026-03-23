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
// Notice: We keep the route name but we'll use it to update role and allowedSections
const updateUserRole = async (req, res) => {
    try {
        const { role, allowedSections, password } = req.body;
        const validRoles = ['SUPER_ADMIN', 'ADMIN', 'HR', 'TEAM_LEADER', 'MANAGER', 'BDE', 'BDA', 'USER'];
        if (role && !validRoles.includes(role)) {
            res.status(400).json({ success: false, message: 'Invalid role' });
            return;
        }
        const updateData = {};
        if (role)
            updateData.role = role;
        if (allowedSections)
            updateData.allowedSections = allowedSections;
        if (password)
            updateData.password = password;
        const user = await User_1.default.findById(req.params.id);
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        if (role)
            user.role = role;
        if (allowedSections)
            user.allowedSections = allowedSections;
        if (password)
            user.password = password;
        await user.save();
        // Remove password from response
        const userObj = user.toObject();
        delete userObj.password;
        res.json({ success: true, data: userObj });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
exports.updateUserRole = updateUserRole;
