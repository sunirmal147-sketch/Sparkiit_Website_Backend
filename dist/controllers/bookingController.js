"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBooking = exports.updateBookingStatus = exports.getAllBookings = exports.getMyBookings = exports.createBooking = void 0;
const Booking_1 = __importDefault(require("../models/Booking"));
const Course_1 = __importDefault(require("../models/Course"));
// POST /api/public/bookings (Candidate)
const createBooking = async (req, res) => {
    try {
        const { courseId, slotDate, slotTime, notes } = req.body;
        const candidateId = req.user?._id;
        if (!candidateId) {
            res.status(401).json({ success: false, message: 'Authentication required' });
            return;
        }
        // Verify course exists
        const course = await Course_1.default.findById(courseId);
        if (!course) {
            res.status(404).json({ success: false, message: 'Course not found' });
            return;
        }
        const booking = await Booking_1.default.create({
            candidate: candidateId,
            course: courseId,
            slotDate,
            slotTime,
            notes,
            status: 'pending'
        });
        res.status(201).json({ success: true, data: booking });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
exports.createBooking = createBooking;
// GET /api/public/bookings/my (Candidate)
const getMyBookings = async (req, res) => {
    try {
        const candidateId = req.user?._id;
        const bookings = await Booking_1.default.find({ candidate: candidateId })
            .populate('course', 'title category duration')
            .sort({ createdAt: -1 });
        res.json({ success: true, data: bookings });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
exports.getMyBookings = getMyBookings;
// GET /api/admin/bookings (Admin)
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking_1.default.find({})
            .populate('candidate', 'name email phone')
            .populate('course', 'title category')
            .sort({ createdAt: -1 });
        res.json({ success: true, data: bookings, count: bookings.length });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
exports.getAllBookings = getAllBookings;
// PUT /api/admin/bookings/:id (Admin)
const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking_1.default.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
        if (!booking) {
            res.status(404).json({ success: false, message: 'Booking not found' });
            return;
        }
        res.json({ success: true, data: booking });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
exports.updateBookingStatus = updateBookingStatus;
// DELETE /api/admin/bookings/:id (Admin)
const deleteBooking = async (req, res) => {
    try {
        const booking = await Booking_1.default.findByIdAndDelete(req.params.id);
        if (!booking) {
            res.status(404).json({ success: false, message: 'Booking not found' });
            return;
        }
        res.json({ success: true, message: 'Booking deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
exports.deleteBooking = deleteBooking;
