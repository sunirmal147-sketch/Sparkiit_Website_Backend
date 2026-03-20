"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCertificate = exports.createCertificate = exports.getAllCertificates = exports.validateCertificate = void 0;
const Certificate_1 = __importDefault(require("../models/Certificate"));
// Public: Validate certificate by email
// GET /api/public/validate-certificate?email=...
const validateCertificate = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            res.status(400).json({ success: false, message: 'Email is required' });
            return;
        }
        const certificates = await Certificate_1.default.find({ candidateEmail: email.toLowerCase() })
            .sort({ issueDate: -1 });
        if (!certificates || certificates.length === 0) {
            res.status(404).json({ success: false, message: 'No certificates found for this email' });
            return;
        }
        res.json({ success: true, data: certificates });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
exports.validateCertificate = validateCertificate;
// Admin: Get all certificates
// GET /api/admin/certificates
const getAllCertificates = async (req, res) => {
    try {
        const { search } = req.query;
        const filter = {};
        if (search) {
            filter.$or = [
                { candidateName: { $regex: search, $options: 'i' } },
                { candidateEmail: { $regex: search, $options: 'i' } },
                { certificateId: { $regex: search, $options: 'i' } },
                { courseName: { $regex: search, $options: 'i' } },
            ];
        }
        const certificates = await Certificate_1.default.find(filter).sort({ createdAt: -1 });
        res.json({ success: true, data: certificates, count: certificates.length });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
exports.getAllCertificates = getAllCertificates;
// Admin: Create certificate
// POST /api/admin/certificates
const createCertificate = async (req, res) => {
    try {
        const { certificateId, candidateName, candidateEmail, courseName, issueDate, grade } = req.body;
        const certificate = await Certificate_1.default.create({
            certificateId,
            candidateName,
            candidateEmail,
            courseName,
            issueDate: issueDate || new Date(),
            grade,
        });
        res.status(201).json({ success: true, data: certificate });
    }
    catch (error) {
        if (error.name === 'ValidationError') {
            res.status(400).json({ success: false, message: 'Validation error', error: error.message });
            return;
        }
        if (error.code === 11000) {
            res.status(400).json({ success: false, message: 'Certificate ID already exists' });
            return;
        }
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
exports.createCertificate = createCertificate;
// Admin: Delete certificate
// DELETE /api/admin/certificates/:id
const deleteCertificate = async (req, res) => {
    try {
        const certificate = await Certificate_1.default.findByIdAndDelete(req.params.id);
        if (!certificate) {
            res.status(404).json({ success: false, message: 'Certificate not found' });
            return;
        }
        res.json({ success: true, message: 'Certificate deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
exports.deleteCertificate = deleteCertificate;
