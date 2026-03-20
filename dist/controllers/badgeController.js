"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBadge = exports.updateBadge = exports.createBadge = exports.getAllBadges = void 0;
const Badge_1 = __importDefault(require("../models/Badge"));
const getAllBadges = async (req, res) => {
    try {
        const items = await Badge_1.default.find();
        res.json({ success: true, data: items });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAllBadges = getAllBadges;
const createBadge = async (req, res) => {
    try {
        const newItem = new Badge_1.default(req.body);
        await newItem.save();
        res.status(201).json({ success: true, data: newItem });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.createBadge = createBadge;
const updateBadge = async (req, res) => {
    try {
        const updatedItem = await Badge_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
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
exports.updateBadge = updateBadge;
const deleteBadge = async (req, res) => {
    try {
        const deletedItem = await Badge_1.default.findByIdAndDelete(req.params.id);
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
exports.deleteBadge = deleteBadge;
