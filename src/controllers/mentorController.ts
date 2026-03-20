import { Request, Response } from 'express';
import Mentor from '../models/Mentor';

// GET /api/admin/mentors
export const getAllMentors = async (req: Request, res: Response): Promise<void> => {
    try {
        const mentors = await Mentor.find().sort({ order: 1, createdAt: -1 });
        res.json({ success: true, data: mentors });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

// GET /api/public/mentors
export const getPublicMentors = async (_req: Request, res: Response): Promise<void> => {
    try {
        const mentors = await Mentor.find().sort({ order: 1, createdAt: -1 });
        res.json({ success: true, data: mentors });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

// POST /api/admin/mentors
export const createMentor = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description, photo, order } = req.body;
        const mentor = await Mentor.create({ name, description, photo, order });
        res.status(201).json({ success: true, data: mentor });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

// PUT /api/admin/mentors/:id
export const updateMentor = async (req: Request, res: Response): Promise<void> => {
    try {
        const mentor = await Mentor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!mentor) {
            res.status(404).json({ success: false, message: 'Mentor not found' });
            return;
        }
        res.json({ success: true, data: mentor });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

// DELETE /api/admin/mentors/:id
export const deleteMentor = async (req: Request, res: Response): Promise<void> => {
    try {
        const mentor = await Mentor.findByIdAndDelete(req.params.id);
        if (!mentor) {
            res.status(404).json({ success: false, message: 'Mentor not found' });
            return;
        }
        res.json({ success: true, message: 'Mentor deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
