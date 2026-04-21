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
        const query = req.user.role === 'SUPER_ADMIN' ? {} : { role: { $ne: 'SUPER_ADMIN' } };
        const users = await User_1.default.find(query).select('-password').sort({ createdAt: -1 });
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
// Notice: We keep the route name but we'll use it to update role, allowedSections, and reportingTo
const updateUserRole = async (req, res) => {
    try {
        const { role, allowedSections, password, reportingTo } = req.body;
        const validRoles = ['SUPER_ADMIN', 'ADMIN', 'HR', 'TEAM_LEADER', 'MANAGER', 'BDE', 'BDA', 'USER'];
        if (role && !validRoles.includes(role)) {
            res.status(400).json({ success: false, message: 'Invalid role' });
            return;
        }
        // Only existing Super Admin can assign Super Admin role
        if (role === 'SUPER_ADMIN' && req.user.role !== 'SUPER_ADMIN') {
            res.status(403).json({ success: false, message: 'Not authorized to assign Super Admin role' });
            return;
        }
        const user = await User_1.default.findById(req.params.id);
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        // Only Super Admin can modify other Super Admins
        if (user.role === 'SUPER_ADMIN' && req.user.role !== 'SUPER_ADMIN') {
            res.status(403).json({ success: false, message: 'Not authorized to modify Super Admin' });
            return;
        }
        if (role)
            user.role = role;
        if (allowedSections !== undefined)
            user.allowedSections = allowedSections;
        if (password)
            user.password = password;
        if (reportingTo !== undefined) {
            user.reportingTo = reportingTo === '' || reportingTo === null ? undefined : reportingTo;
        }
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
