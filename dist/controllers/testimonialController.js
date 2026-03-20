"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTestimonial = exports.updateTestimonial = exports.createTestimonial = exports.getAllTestimonialsAdmin = exports.getAllTestimonialsPublic = void 0;
const Testimonial_1 = __importDefault(require("../models/Testimonial"));
// GET /api/public/testimonials
const getAllTestimonialsPublic = async (_req, res) => {
    try {
        const testimonials = await Testimonial_1.default.find().sort({ order: 1 });
        res.json({ success: true, data: testimonials });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
exports.getAllTestimonialsPublic = getAllTestimonialsPublic;
// GET /api/admin/testimonials
const getAllTestimonialsAdmin = async (_req, res) => {
    try {
        const testimonials = await Testimonial_1.default.find().sort({ order: 1 });
        res.json({ success: true, data: testimonials });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
exports.getAllTestimonialsAdmin = getAllTestimonialsAdmin;
// POST /api/admin/testimonials
const createTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial_1.default.create(req.body);
        res.status(201).json({ success: true, data: testimonial });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
exports.createTestimonial = createTestimonial;
// PUT /api/admin/testimonials/:id
const updateTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!testimonial) {
            res.status(404).json({ success: false, message: 'Testimonial not found' });
            return;
        }
        res.json({ success: true, data: testimonial });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
exports.updateTestimonial = updateTestimonial;
// DELETE /api/admin/testimonials/:id
const deleteTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial_1.default.findByIdAndDelete(req.params.id);
        if (!testimonial) {
            res.status(404).json({ success: false, message: 'Testimonial not found' });
            return;
        }
        res.json({ success: true, message: 'Testimonial deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
exports.deleteTestimonial = deleteTestimonial;
