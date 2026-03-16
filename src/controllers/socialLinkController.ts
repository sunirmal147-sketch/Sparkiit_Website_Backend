import { Request, Response } from 'express';
import SocialLink from '../models/SocialLink';

export const getAllSocialLinks = async (req: Request, res: Response): Promise<void> => {
    try {
        const items = await SocialLink.find();
        res.json({ success: true, data: items });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createSocialLink = async (req: Request, res: Response): Promise<void> => {
    try {
        const newItem = new SocialLink(req.body);
        await newItem.save();
        res.status(201).json({ success: true, data: newItem });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updateSocialLink = async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedItem = await SocialLink.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedItem) { res.status(404).json({ success: false, message: 'Not found' }); return; }
        res.json({ success: true, data: updatedItem });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteSocialLink = async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedItem = await SocialLink.findByIdAndDelete(req.params.id);
        if (!deletedItem) { res.status(404).json({ success: false, message: 'Not found' }); return; }
        res.json({ success: true, message: 'Deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
