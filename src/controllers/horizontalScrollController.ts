import { Request, Response } from 'express';
import HorizontalScrollItem from '../models/HorizontalScrollItem';

// GET /api/admin/horizontal-scroll
export const getAllHorizontalScrollItemsAdmin = async (_req: Request, res: Response): Promise<void> => {
    try {
        const items = await HorizontalScrollItem.find().sort({ order: 1 });
        res.json({ success: true, data: items });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

// POST /api/admin/horizontal-scroll
export const createHorizontalScrollItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const item = await HorizontalScrollItem.create(req.body);
        res.status(201).json({ success: true, data: item });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

// PUT /api/admin/horizontal-scroll/:id
export const updateHorizontalScrollItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const item = await HorizontalScrollItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!item) {
            res.status(404).json({ success: false, message: 'Item not found' });
            return;
        }
        res.json({ success: true, data: item });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

// DELETE /api/admin/horizontal-scroll/:id
export const deleteHorizontalScrollItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const item = await HorizontalScrollItem.findByIdAndDelete(req.params.id);
        if (!item) {
            res.status(404).json({ success: false, message: 'Item not found' });
            return;
        }
        res.json({ success: true, message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
