import { Request, Response } from 'express';
import Chapter from '../models/Chapter';
import Lesson from '../models/Lesson';

// GET /api/admin/chapters?courseId=...
export const getChaptersByCourse = async (req: Request, res: Response): Promise<void> => {
    try {
        const { courseId } = req.query;
        if (!courseId) {
            res.status(400).json({ success: false, message: 'courseId is required' });
            return;
        }
        const chapters = await Chapter.find({ courseId }).sort({ order: 1 });
        res.json({ success: true, data: chapters });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST /api/admin/chapters
export const createChapter = async (req: Request, res: Response): Promise<void> => {
    try {
        const { courseId, title, order } = req.body;
        const chapter = await Chapter.create({ courseId, title, order });
        res.status(201).json({ success: true, data: chapter });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// PUT /api/admin/chapters/:id
export const updateChapter = async (req: Request, res: Response): Promise<void> => {
    try {
        const chapter = await Chapter.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!chapter) {
            res.status(404).json({ success: false, message: 'Chapter not found' });
            return;
        }
        res.json({ success: true, data: chapter });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// DELETE /api/admin/chapters/:id
export const deleteChapter = async (req: Request, res: Response): Promise<void> => {
    try {
        const chapterId = req.params.id;
        const chapter = await Chapter.findByIdAndDelete(chapterId);
        if (!chapter) {
            res.status(404).json({ success: false, message: 'Chapter not found' });
            return;
        }
        // Also delete all lessons in this chapter
        await Lesson.deleteMany({ chapterId });
        res.json({ success: true, message: 'Chapter and its lessons deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
