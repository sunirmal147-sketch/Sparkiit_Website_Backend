"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMentor = exports.updateMentor = exports.createMentor = exports.getPublicMentors = exports.getAllMentors = void 0;
const Mentor_1 = __importDefault(require("../models/Mentor"));
// GET /api/admin/mentors
const getAllMentors = async (req, res) => {
    try {
        const mentors = await Mentor_1.default.find().sort({ order: 1, createdAt: -1 });
        res.json({ success: true, data: mentors });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
exports.getAllMentors = getAllMentors;
// GET /api/public/mentors
const getPublicMentors = async (_req, res) => {
    try {
        const mentors = await Mentor_1.default.find().sort({ order: 1, createdAt: -1 });
        res.json({ success: true, data: mentors });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
exports.getPublicMentors = getPublicMentors;
// POST /api/admin/mentors
const createMentor = async (req, res) => {
    try {
        const { name, description, photo, order } = req.body;
        const mentor = await Mentor_1.default.create({ name, description, photo, order });
        res.status(201).json({ success: true, data: mentor });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
exports.createMentor = createMentor;
// PUT /api/admin/mentors/:id
const updateMentor = async (req, res) => {
    try {
        const mentor = await Mentor_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!mentor) {
            res.status(404).json({ success: false, message: 'Mentor not found' });
            return;
        }
        res.json({ success: true, data: mentor });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
exports.updateMentor = updateMentor;
// DELETE /api/admin/mentors/:id
const deleteMentor = async (req, res) => {
    try {
        const mentor = await Mentor_1.default.findByIdAndDelete(req.params.id);
        if (!mentor) {
            res.status(404).json({ success: false, message: 'Mentor not found' });
            return;
        }
        res.json({ success: true, message: 'Mentor deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
exports.deleteMentor = deleteMentor;
