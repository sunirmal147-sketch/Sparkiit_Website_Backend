"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteChapter = exports.updateChapter = exports.createChapter = exports.getChaptersByCourse = void 0;
const Chapter_1 = __importDefault(require("../models/Chapter"));
const Lesson_1 = __importDefault(require("../models/Lesson"));
// GET /api/admin/chapters?courseId=...
const getChaptersByCourse = async (req, res) => {
    try {
        const { courseId } = req.query;
        if (!courseId) {
            res.status(400).json({ success: false, message: 'courseId is required' });
            return;
        }
        const chapters = await Chapter_1.default.find({ courseId }).sort({ order: 1 });
        res.json({ success: true, data: chapters });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getChaptersByCourse = getChaptersByCourse;
// POST /api/admin/chapters
const createChapter = async (req, res) => {
    try {
        const { courseId, title, order } = req.body;
        const chapter = await Chapter_1.default.create({ courseId, title, order });
        res.status(201).json({ success: true, data: chapter });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.createChapter = createChapter;
// PUT /api/admin/chapters/:id
const updateChapter = async (req, res) => {
    try {
        const chapter = await Chapter_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!chapter) {
            res.status(404).json({ success: false, message: 'Chapter not found' });
            return;
        }
        res.json({ success: true, data: chapter });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.updateChapter = updateChapter;
// DELETE /api/admin/chapters/:id
const deleteChapter = async (req, res) => {
    try {
        const chapterId = req.params.id;
        const chapter = await Chapter_1.default.findByIdAndDelete(chapterId);
        if (!chapter) {
            res.status(404).json({ success: false, message: 'Chapter not found' });
            return;
        }
        // Also delete all lessons in this chapter
        await Lesson_1.default.deleteMany({ chapterId });
        res.json({ success: true, message: 'Chapter and its lessons deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteChapter = deleteChapter;
