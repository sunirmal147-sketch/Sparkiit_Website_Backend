import { Request, Response } from 'express';
import Lesson from '../models/Lesson';

// GET /api/admin/lessons?chapterId=...
export const getLessonsByChapter = async (req: Request, res: Response): Promise<void> => {
    try {
        const { chapterId } = req.query;
        if (!chapterId) {
            res.status(400).json({ success: false, message: 'chapterId is required' });
            return;
        }
        const lessons = await Lesson.find({ chapterId }).sort({ order: 1 });
        res.json({ success: true, data: lessons });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST /api/admin/lessons
export const createLesson = async (req: Request, res: Response): Promise<void> => {
    try {
        const lesson = await Lesson.create(req.body);
        res.status(201).json({ success: true, data: lesson });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// PUT /api/admin/lessons/:id
export const updateLesson = async (req: Request, res: Response): Promise<void> => {
    try {
        const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!lesson) {
            res.status(404).json({ success: false, message: 'Lesson not found' });
            return;
        }
        res.json({ success: true, data: lesson });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// DELETE /api/admin/lessons/:id
export const deleteLesson = async (req: Request, res: Response): Promise<void> => {
    try {
        const lesson = await Lesson.findByIdAndDelete(req.params.id);
        if (!lesson) {
            res.status(404).json({ success: false, message: 'Lesson not found' });
            return;
        }
        res.json({ success: true, message: 'Lesson deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
