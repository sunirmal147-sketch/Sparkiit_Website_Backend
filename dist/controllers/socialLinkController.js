"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSocialLink = exports.updateSocialLink = exports.createSocialLink = exports.getAllSocialLinks = void 0;
const SocialLink_1 = __importDefault(require("../models/SocialLink"));
const getAllSocialLinks = async (req, res) => {
    try {
        const items = await SocialLink_1.default.find();
        res.json({ success: true, data: items });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAllSocialLinks = getAllSocialLinks;
const createSocialLink = async (req, res) => {
    try {
        const newItem = new SocialLink_1.default(req.body);
        await newItem.save();
        res.status(201).json({ success: true, data: newItem });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.createSocialLink = createSocialLink;
const updateSocialLink = async (req, res) => {
    try {
        const updatedItem = await SocialLink_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
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
exports.updateSocialLink = updateSocialLink;
const deleteSocialLink = async (req, res) => {
    try {
        const deletedItem = await SocialLink_1.default.findByIdAndDelete(req.params.id);
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
exports.deleteSocialLink = deleteSocialLink;
