"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLesson = exports.updateLesson = exports.createLesson = exports.getLessonsByChapter = void 0;
const Lesson_1 = __importDefault(require("../models/Lesson"));
// GET /api/admin/lessons?chapterId=...
const getLessonsByChapter = async (req, res) => {
    try {
        const { chapterId } = req.query;
        if (!chapterId) {
            res.status(400).json({ success: false, message: 'chapterId is required' });
            return;
        }
        const lessons = await Lesson_1.default.find({ chapterId }).sort({ order: 1 });
        res.json({ success: true, data: lessons });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getLessonsByChapter = getLessonsByChapter;
// POST /api/admin/lessons
const createLesson = async (req, res) => {
    try {
        const lesson = await Lesson_1.default.create(req.body);
        res.status(201).json({ success: true, data: lesson });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.createLesson = createLesson;
// PUT /api/admin/lessons/:id
const updateLesson = async (req, res) => {
    try {
        const lesson = await Lesson_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!lesson) {
            res.status(404).json({ success: false, message: 'Lesson not found' });
            return;
        }
        res.json({ success: true, data: lesson });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.updateLesson = updateLesson;
// DELETE /api/admin/lessons/:id
const deleteLesson = async (req, res) => {
    try {
        const lesson = await Lesson_1.default.findByIdAndDelete(req.params.id);
        if (!lesson) {
            res.status(404).json({ success: false, message: 'Lesson not found' });
            return;
        }
        res.json({ success: true, message: 'Lesson deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteLesson = deleteLesson;
