"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.signup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Candidate_1 = __importDefault(require("../models/Candidate"));
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id, role: 'CANDIDATE' }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};
const signup = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        const candidateExists = await Candidate_1.default.findOne({ email });
        if (candidateExists) {
            res.status(400).json({ success: false, message: 'User already exists' });
            return;
        }
        const candidate = await Candidate_1.default.create({
            name,
            email,
            password,
            phone,
        });
        res.status(201).json({
            success: true,
            data: {
                _id: candidate._id,
                name: candidate.name,
                email: candidate.email,
                token: generateToken(candidate._id),
            },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const candidate = await Candidate_1.default.findOne({ email }).select('+password');
        if (candidate && (await candidate.comparePassword(password))) {
            res.json({
                success: true,
                data: {
                    _id: candidate._id,
                    name: candidate.name,
                    email: candidate.email,
                    token: generateToken(candidate._id),
                },
            });
        }
        else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        const candidate = await Candidate_1.default.findById(req.user.id).populate('enrolledCourses');
        if (!candidate) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        res.json({ success: true, data: candidate });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getMe = getMe;
