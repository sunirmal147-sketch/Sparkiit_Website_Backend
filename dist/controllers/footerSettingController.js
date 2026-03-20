"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFooterSetting = exports.updateFooterSetting = exports.createFooterSetting = exports.getAllFooterSettings = void 0;
const FooterSetting_1 = __importDefault(require("../models/FooterSetting"));
const getAllFooterSettings = async (req, res) => {
    try {
        const items = await FooterSetting_1.default.find();
        res.json({ success: true, data: items });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAllFooterSettings = getAllFooterSettings;
const createFooterSetting = async (req, res) => {
    try {
        const newItem = new FooterSetting_1.default(req.body);
        await newItem.save();
        res.status(201).json({ success: true, data: newItem });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.createFooterSetting = createFooterSetting;
const updateFooterSetting = async (req, res) => {
    try {
        const updatedItem = await FooterSetting_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
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
exports.updateFooterSetting = updateFooterSetting;
const deleteFooterSetting = async (req, res) => {
    try {
        const deletedItem = await FooterSetting_1.default.findByIdAndDelete(req.params.id);
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
exports.deleteFooterSetting = deleteFooterSetting;
