import { Request, Response } from 'express';
import Event from '../models/Event';

// @desc    Get all events
// @route   GET /api/public/events
// @access  Public
export const getAllEventsPublic = async (_req: Request, res: Response): Promise<void> => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.status(200).json({ success: true, count: events.length, data: events });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Get all events for Admin
// @route   GET /api/admin/events
// @access  Private/Admin
export const getAllEventsAdmin = async (_req: Request, res: Response): Promise<void> => {
    try {
        const events = await Event.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: events.length, data: events });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Create a new event
// @route   POST /api/admin/events
// @access  Private/Admin
export const createEvent = async (req: Request, res: Response): Promise<void> => {
    try {
        const event = await Event.create(req.body);
        res.status(201).json({ success: true, data: event });
    } catch (error: any) {
        res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
    }
};

// @desc    Update an event
// @route   PUT /api/admin/events/:id
// @access  Private/Admin
export const updateEvent = async (req: Request, res: Response): Promise<void> => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!event) {
            res.status(404).json({ success: false, message: 'Event not found' });
            return;
        }

        res.status(200).json({ success: true, data: event });
    } catch (error: any) {
        res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
    }
};

// @desc    Delete an event
// @route   DELETE /api/admin/events/:id
// @access  Private/Admin
export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);

        if (!event) {
            res.status(404).json({ success: false, message: 'Event not found' });
            return;
        }

        res.status(200).json({ success: true, message: 'Event deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
