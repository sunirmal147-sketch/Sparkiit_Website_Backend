import { Request, Response } from 'express';
import Faq from '../models/Faq';

export const getAllFaqs = async (req: Request, res: Response): Promise<void> => {
    try {
        const items = await Faq.find().sort({ order: 1, createdAt: -1 });
        res.json({ success: true, data: items });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createFaq = async (req: Request, res: Response): Promise<void> => {
    try {
        const newItem = new Faq(req.body);
        await newItem.save();
        res.status(201).json({ success: true, data: newItem });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updateFaq = async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedItem = await Faq.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedItem) { res.status(404).json({ success: false, message: 'Not found' }); return; }
        res.json({ success: true, data: updatedItem });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteFaq = async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedItem = await Faq.findByIdAndDelete(req.params.id);
        if (!deletedItem) { res.status(404).json({ success: false, message: 'Not found' }); return; }
        res.json({ success: true, message: 'Deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
