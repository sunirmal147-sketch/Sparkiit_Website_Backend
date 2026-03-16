import { Request, Response } from 'express';
import SectionContent from '../models/SectionContent';

// GET /api/admin/content
export const getAllContent = async (_req: Request, res: Response): Promise<void> => {
    try {
        const contents = await SectionContent.find();
        res.json({ success: true, data: contents });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

// PUT /api/admin/content/batch
export const updateContentBatch = async (req: Request, res: Response): Promise<void> => {
    try {
        const { updates } = req.body; // Array of { section, key, value }

        if (!Array.isArray(updates)) {
            res.status(400).json({ success: false, message: 'Updates must be an array' });
            return;
        }

        const operations = updates.map((update) => ({
            updateOne: {
                filter: { section: update.section, key: update.key },
                update: { value: update.value },
                upsert: true,
            },
        }));

        await SectionContent.bulkWrite(operations);

        res.json({ success: true, message: 'Content updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

// POST /api/admin/content
export const updateSingleContent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { section, key, value } = req.body;
        const content = await SectionContent.findOneAndUpdate(
            { section, key },
            { value },
            { new: true, upsert: true }
        );
        res.json({ success: true, data: content });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
