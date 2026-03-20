"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteService = exports.updateService = exports.createService = exports.getAllServicesAdmin = void 0;
const Service_1 = __importDefault(require("../models/Service"));
// GET /api/admin/services
const getAllServicesAdmin = async (_req, res) => {
    try {
        const services = await Service_1.default.find().sort({ order: 1 });
        res.json({ success: true, data: services });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
exports.getAllServicesAdmin = getAllServicesAdmin;
// POST /api/admin/services
const createService = async (req, res) => {
    try {
        const service = await Service_1.default.create(req.body);
        res.status(201).json({ success: true, data: service });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
exports.createService = createService;
// PUT /api/admin/services/:id
const updateService = async (req, res) => {
    try {
        const service = await Service_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!service) {
            res.status(404).json({ success: false, message: 'Service not found' });
            return;
        }
        res.json({ success: true, data: service });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
exports.updateService = updateService;
// DELETE /api/admin/services/:id
const deleteService = async (req, res) => {
    try {
        const service = await Service_1.default.findByIdAndDelete(req.params.id);
        if (!service) {
            res.status(404).json({ success: false, message: 'Service not found' });
            return;
        }
        res.json({ success: true, message: 'Service deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
exports.deleteService = deleteService;
