"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSetting = exports.updateSetting = exports.createSetting = exports.upsertSetting = exports.updateSettingsBulk = exports.getAllSettings = void 0;
const Setting_1 = __importDefault(require("../models/Setting"));
// GET /api/admin/settings
const getAllSettings = async (req, res) => {
    try {
        const { group } = req.query;
        const filter = group ? { group } : {};
        const items = await Setting_1.default.find(filter);
        res.json({ success: true, data: items });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAllSettings = getAllSettings;
// PUT /api/admin/settings/bulk
// Body: { settings: { [key: string]: { value: any, group: string } } }
const updateSettingsBulk = async (req, res) => {
    try {
        const { settings } = req.body;
        if (!settings || typeof settings !== 'object') {
            res.status(400).json({ success: false, message: 'Invalid settings data' });
            return;
        }
        const updates = Object.entries(settings).map(([key, data]) => {
            return Setting_1.default.findOneAndUpdate({ key }, { value: data.value, group: data.group }, { upsert: true, new: true, runValidators: true });
        });
        const results = await Promise.all(updates);
        res.json({ success: true, data: results });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.updateSettingsBulk = updateSettingsBulk;
const upsertSetting = async (req, res) => {
    try {
        const { key, value, group } = req.body;
        if (!key) {
            res.status(400).json({ success: false, message: 'Key is required' });
            return;
        }
        const item = await Setting_1.default.findOneAndUpdate({ key }, { value, group }, { new: true, upsert: true, runValidators: true });
        res.json({ success: true, data: item });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.upsertSetting = upsertSetting;
const createSetting = async (req, res) => {
    try {
        const newItem = new Setting_1.default(req.body);
        await newItem.save();
        res.status(201).json({ success: true, data: newItem });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.createSetting = createSetting;
const updateSetting = async (req, res) => {
    try {
        const updatedItem = await Setting_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedItem) {
            res.status(404).json({ success: false, message: 'Not found' });
            return;
        }
        res.json({ success: true, data: updatedItem });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.updateSetting = updateSetting;
const deleteSetting = async (req, res) => {
    try {
        const deletedItem = await Setting_1.default.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            res.status(404).json({ success: false, message: 'Not found' });
            return;
        }
        res.json({ success: true, message: 'Deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteSetting = deleteSetting;
