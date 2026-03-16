import { Request, Response } from 'express';
import Brand from '../models/Brand';

export const getAllBrands = async (req: Request, res: Response): Promise<void> => {
    try {
        const items = await Brand.find();
        res.json({ success: true, data: items });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createBrand = async (req: Request, res: Response): Promise<void> => {
    try {
        const newItem = new Brand(req.body);
        await newItem.save();
        res.status(201).json({ success: true, data: newItem });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updateBrand = async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedItem = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedItem) { res.status(404).json({ success: false, message: 'Not found' }); return; }
        res.json({ success: true, data: updatedItem });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteBrand = async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedItem = await Brand.findByIdAndDelete(req.params.id);
        if (!deletedItem) { res.status(404).json({ success: false, message: 'Not found' }); return; }
        res.json({ success: true, message: 'Deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
