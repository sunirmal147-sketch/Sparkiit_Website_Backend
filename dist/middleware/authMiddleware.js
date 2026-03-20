"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const Candidate_1 = __importDefault(require("../models/Candidate"));
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    const session = req.session;
    if (token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret');
            if (decoded.role === 'CANDIDATE') {
                req.user = await Candidate_1.default.findById(decoded.id).select('-password');
            }
            else {
                req.user = await User_1.default.findById(decoded.id).select('-password');
            }
            if (!req.user) {
                res.status(401).json({ success: false, message: 'Not authorized, user not found' });
                return;
            }
            next();
            return;
        }
        catch (error) {
            res.status(401).json({ success: false, message: 'Not authorized, token failed' });
            return;
        }
    }
    else if (session && session.userId) {
        try {
            if (session.role === 'CANDIDATE') {
                req.user = await Candidate_1.default.findById(session.userId).select('-password');
            }
            else {
                req.user = await User_1.default.findById(session.userId).select('-password');
            }
            if (!req.user) {
                res.status(401).json({ success: false, message: 'Not authorized, user not found' });
                return;
            }
            next();
            return;
        }
        catch (error) {
            res.status(401).json({ success: false, message: 'Not authorized, session failed' });
            return;
        }
    }
    else {
        res.status(401).json({ success: false, message: 'Not authorized, please login' });
        return;
    }
};
exports.protect = protect;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({ success: false, message: `Role ${req.user?.role} is not authorized to access this route` });
            return;
        }
        next();
    };
};
exports.authorize = authorize;
