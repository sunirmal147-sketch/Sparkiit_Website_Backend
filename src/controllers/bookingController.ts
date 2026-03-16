import { Request, Response } from 'express';
import Booking from '../models/Booking';
import Course from '../models/Course';
import Candidate from '../models/Candidate';

// POST /api/public/bookings (Candidate)
export const createBooking = async (req: Request, res: Response): Promise<void> => {
    try {
        const { courseId, slotDate, slotTime, notes } = req.body;
        const candidateId = (req as any).user?._id;

        if (!candidateId) {
            res.status(401).json({ success: false, message: 'Authentication required' });
            return;
        }

        // Verify course exists
        const course = await Course.findById(courseId);
        if (!course) {
            res.status(404).json({ success: false, message: 'Course not found' });
            return;
        }

        const booking = await Booking.create({
            candidate: candidateId,
            course: courseId,
            slotDate,
            slotTime,
            notes,
            status: 'pending'
        });

        res.status(201).json({ success: true, data: booking });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// GET /api/public/bookings/my (Candidate)
export const getMyBookings = async (req: Request, res: Response): Promise<void> => {
    try {
        const candidateId = (req as any).user?._id;
        const bookings = await Booking.find({ candidate: candidateId })
            .populate('course', 'title category duration')
            .sort({ createdAt: -1 });

        res.json({ success: true, data: bookings });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// GET /api/admin/bookings (Admin)
export const getAllBookings = async (req: Request, res: Response): Promise<void> => {
    try {
        const bookings = await Booking.find({})
            .populate('candidate', 'name email phone')
            .populate('course', 'title category')
            .sort({ createdAt: -1 });

        res.json({ success: true, data: bookings, count: bookings.length });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// PUT /api/admin/bookings/:id (Admin)
export const updateBookingStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { status } = req.body;
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!booking) {
            res.status(404).json({ success: false, message: 'Booking not found' });
            return;
        }

        res.json({ success: true, data: booking });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// DELETE /api/admin/bookings/:id (Admin)
export const deleteBooking = async (req: Request, res: Response): Promise<void> => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);
        if (!booking) {
            res.status(404).json({ success: false, message: 'Booking not found' });
            return;
        }
        res.json({ success: true, message: 'Booking deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
