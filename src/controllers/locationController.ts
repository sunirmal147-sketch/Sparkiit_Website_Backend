import { Request, Response } from 'express';
import Location from '../models/Location';

export const getAllLocations = async (req: Request, res: Response): Promise<void> => {
    try {
        const items = await Location.find();
        res.json({ success: true, data: items });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createLocation = async (req: Request, res: Response): Promise<void> => {
    try {
        const newItem = new Location(req.body);
        await newItem.save();
        res.status(201).json({ success: true, data: newItem });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updateLocation = async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedItem = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedItem) { res.status(404).json({ success: false, message: 'Not found' }); return; }
        res.json({ success: true, data: updatedItem });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteLocation = async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedItem = await Location.findByIdAndDelete(req.params.id);
        if (!deletedItem) { res.status(404).json({ success: false, message: 'Not found' }); return; }
        res.json({ success: true, message: 'Deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
