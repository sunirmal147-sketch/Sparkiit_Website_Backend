import { Request, Response } from 'express';
import Setting from '../models/Setting';

// GET /api/admin/settings
export const getAllSettings = async (req: Request, res: Response): Promise<void> => {
    try {
        const { group } = req.query;
        const filter = group ? { group } : {};
        const items = await Setting.find(filter);
        res.json({ success: true, data: items });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PUT /api/admin/settings/bulk
// Body: { settings: { [key: string]: { value: any, group: string } } }
export const updateSettingsBulk = async (req: Request, res: Response): Promise<void> => {
    try {
        const { settings } = req.body;
        if (!settings || typeof settings !== 'object') {
            res.status(400).json({ success: false, message: 'Invalid settings data' });
            return;
        }

        const updates = Object.entries(settings).map(([key, data]: [string, any]) => {
            return Setting.findOneAndUpdate(
                { key },
                { value: data.value, group: data.group },
                { upsert: true, new: true, runValidators: true }
            );
        });

        const results = await Promise.all(updates);
        res.json({ success: true, data: results });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const upsertSetting = async (req: Request, res: Response): Promise<void> => {
    try {
        const { key, value, group } = req.body;
        if (!key) {
            res.status(400).json({ success: false, message: 'Key is required' });
            return;
        }
        
        const item = await Setting.findOneAndUpdate(
            { key },
            { value, group },
            { new: true, upsert: true, runValidators: true }
        );
        res.json({ success: true, data: item });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const createSetting = async (req: Request, res: Response): Promise<void> => {
    try {
        const newItem = new Setting(req.body);
        await newItem.save();
        res.status(201).json({ success: true, data: newItem });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updateSetting = async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedItem = await Setting.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedItem) {
            res.status(404).json({ success: false, message: 'Not found' });
            return;
        }
        res.json({ success: true, data: updatedItem });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteSetting = async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedItem = await Setting.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            res.status(404).json({ success: false, message: 'Not found' });
            return;
        }
        res.json({ success: true, message: 'Deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

