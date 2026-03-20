"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSingleContent = exports.updateContentBatch = exports.getAllContent = void 0;
const SectionContent_1 = __importDefault(require("../models/SectionContent"));
// GET /api/admin/content
const getAllContent = async (_req, res) => {
    try {
        const contents = await SectionContent_1.default.find();
        res.json({ success: true, data: contents });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
exports.getAllContent = getAllContent;
// PUT /api/admin/content/batch
const updateContentBatch = async (req, res) => {
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
        await SectionContent_1.default.bulkWrite(operations);
        res.json({ success: true, message: 'Content updated successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
exports.updateContentBatch = updateContentBatch;
// POST /api/admin/content
const updateSingleContent = async (req, res) => {
    try {
        const { section, key, value } = req.body;
        const content = await SectionContent_1.default.findOneAndUpdate({ section, key }, { value }, { new: true, upsert: true });
        res.json({ success: true, data: content });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
exports.updateSingleContent = updateSingleContent;
