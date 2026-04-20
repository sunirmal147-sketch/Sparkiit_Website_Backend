import { Request, Response } from 'express';
import PageModel from '../models/PageModel';

export const getAllPageModels = async (req: Request, res: Response): Promise<void> => {
    try {
        const items = await PageModel.find();
        res.json({ success: true, data: items });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createPageModel = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, slug, sections } = req.body;
        // Auto-generate slug if not provided
        const finalSlug = slug || name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        
        const newItem = new PageModel({ name, slug: finalSlug, sections });
        await newItem.save();
        res.status(201).json({ success: true, data: newItem });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getPageBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
        const item = await PageModel.findOne({ slug: req.params.slug });
        if (!item) { res.status(404).json({ success: false, message: 'Page not found' }); return; }
        res.json({ success: true, data: item });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updatePageModel = async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedItem = await PageModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedItem) { res.status(404).json({ success: false, message: 'Not found' }); return; }
        res.json({ success: true, data: updatedItem });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deletePageModel = async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedItem = await PageModel.findByIdAndDelete(req.params.id);
        if (!deletedItem) { res.status(404).json({ success: false, message: 'Not found' }); return; }
        res.json({ success: true, message: 'Deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
