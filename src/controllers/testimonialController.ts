import { Request, Response } from 'express';
import Testimonial from '../models/Testimonial';

// GET /api/public/testimonials
export const getAllTestimonialsPublic = async (_req: Request, res: Response): Promise<void> => {
    try {
        const testimonials = await Testimonial.find().sort({ order: 1 });
        res.json({ success: true, data: testimonials });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

// GET /api/admin/testimonials
export const getAllTestimonialsAdmin = async (_req: Request, res: Response): Promise<void> => {
    try {
        const testimonials = await Testimonial.find().sort({ order: 1 });
        res.json({ success: true, data: testimonials });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

// POST /api/admin/testimonials
export const createTestimonial = async (req: Request, res: Response): Promise<void> => {
    try {
        const testimonial = await Testimonial.create(req.body);
        res.status(201).json({ success: true, data: testimonial });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

// PUT /api/admin/testimonials/:id
export const updateTestimonial = async (req: Request, res: Response): Promise<void> => {
    try {
        const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!testimonial) {
            res.status(404).json({ success: false, message: 'Testimonial not found' });
            return;
        }
        res.json({ success: true, data: testimonial });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

// DELETE /api/admin/testimonials/:id
export const deleteTestimonial = async (req: Request, res: Response): Promise<void> => {
    try {
        const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
        if (!testimonial) {
            res.status(404).json({ success: false, message: 'Testimonial not found' });
            return;
        }
        res.json({ success: true, message: 'Testimonial deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
