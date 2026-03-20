"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.getMe = exports.logout = exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const generateToken = (id, role) => {
    return jsonwebtoken_1.default.sign({ id, role }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};
// POST /api/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (user && (await user.comparePassword(password))) {
            // Generate token
            const token = generateToken(user._id.toString(), user.role);
            // Store user info in session
            req.session.userId = user._id;
            req.session.role = user.role;
            res.json({
                success: true,
                message: 'Logged in successfully',
                data: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    token: token,
                },
            });
        }
        else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error', error });
    }
};
exports.login = login;
// GET /api/admin/logout
const logout = async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Could not log out' });
        }
        res.clearCookie('connect.sid'); // Default cookie name
        res.json({ success: true, message: 'Logged out successfully' });
    });
};
exports.logout = logout;
// GET /api/admin/me
const getMe = async (req, res) => {
    if (req.user) {
        res.json({
            success: true,
            data: req.user
        });
    }
    else {
        res.status(401).json({ success: false, message: 'Not logged in' });
    }
};
exports.getMe = getMe;
// POST /api/auth/register (Protected, Super Admin only can create admins)
const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const userExists = await User_1.default.findOne({ email });
        if (userExists) {
            res.status(400).json({ success: false, message: 'User already exists' });
            return;
        }
        const user = await User_1.default.create({
            username,
            email,
            password,
            role: role || 'ADMIN',
        });
        res.status(201).json({
            success: true,
            data: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
exports.register = register;
