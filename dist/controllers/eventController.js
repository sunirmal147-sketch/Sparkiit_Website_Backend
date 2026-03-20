"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvent = exports.updateEvent = exports.createEvent = exports.getAllEventsAdmin = exports.getAllEventsPublic = void 0;
const Event_1 = __importDefault(require("../models/Event"));
// @desc    Get all events
// @route   GET /api/public/events
// @access  Public
const getAllEventsPublic = async (_req, res) => {
    try {
        const events = await Event_1.default.find().sort({ date: 1 });
        res.status(200).json({ success: true, count: events.length, data: events });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
exports.getAllEventsPublic = getAllEventsPublic;
// @desc    Get all events for Admin
// @route   GET /api/admin/events
// @access  Private/Admin
const getAllEventsAdmin = async (_req, res) => {
    try {
        const events = await Event_1.default.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: events.length, data: events });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
exports.getAllEventsAdmin = getAllEventsAdmin;
// @desc    Create a new event
// @route   POST /api/admin/events
// @access  Private/Admin
const createEvent = async (req, res) => {
    try {
        const event = await Event_1.default.create(req.body);
        res.status(201).json({ success: true, data: event });
    }
    catch (error) {
        res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
    }
};
exports.createEvent = createEvent;
// @desc    Update an event
// @route   PUT /api/admin/events/:id
// @access  Private/Admin
const updateEvent = async (req, res) => {
    try {
        const event = await Event_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!event) {
            res.status(404).json({ success: false, message: 'Event not found' });
            return;
        }
        res.status(200).json({ success: true, data: event });
    }
    catch (error) {
        res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
    }
};
exports.updateEvent = updateEvent;
// @desc    Delete an event
// @route   DELETE /api/admin/events/:id
// @access  Private/Admin
const deleteEvent = async (req, res) => {
    try {
        const event = await Event_1.default.findByIdAndDelete(req.params.id);
        if (!event) {
            res.status(404).json({ success: false, message: 'Event not found' });
            return;
        }
        res.status(200).json({ success: true, message: 'Event deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
exports.deleteEvent = deleteEvent;
