import { Request, Response } from 'express';
import Service from '../models/Service';

// GET /api/admin/services
export const getAllServicesAdmin = async (_req: Request, res: Response): Promise<void> => {
    try {
        const services = await Service.find().sort({ order: 1 });
        res.json({ success: true, data: services });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

// POST /api/admin/services
export const createService = async (req: Request, res: Response): Promise<void> => {
    try {
        const service = await Service.create(req.body);
        res.status(201).json({ success: true, data: service });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

// PUT /api/admin/services/:id
export const updateService = async (req: Request, res: Response): Promise<void> => {
    try {
        const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!service) {
            res.status(404).json({ success: false, message: 'Service not found' });
            return;
        }
        res.json({ success: true, data: service });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

// DELETE /api/admin/services/:id
export const deleteService = async (req: Request, res: Response): Promise<void> => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id);
        if (!service) {
            res.status(404).json({ success: false, message: 'Service not found' });
            return;
        }
        res.json({ success: true, message: 'Service deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
