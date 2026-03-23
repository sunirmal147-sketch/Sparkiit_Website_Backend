"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = exports.removeCourse = exports.assignCourse = exports.deleteCandidate = exports.updateCandidate = exports.createCandidate = exports.getCandidateById = exports.getAllCandidates = void 0;
const Candidate_1 = __importDefault(require("../models/Candidate"));
const Course_1 = __importDefault(require("../models/Course"));
// GET /api/admin/candidates
const getAllCandidates = async (req, res) => {
    try {
        const { search, status, courseId } = req.query;
        const filter = {};
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }
        if (status)
            filter.status = status;
        if (courseId)
            filter.enrolledCourses = courseId;
        const candidates = await Candidate_1.default.find(filter)
            .populate('enrolledCourses', 'title category status')
            .sort({ createdAt: -1 });
        res.json({ success: true, data: candidates, count: candidates.length });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
exports.getAllCandidates = getAllCandidates;
// GET /api/admin/candidates/:id
const getCandidateById = async (req, res) => {
    try {
        const candidate = await Candidate_1.default.findById(req.params.id).populate('enrolledCourses');
        if (!candidate) {
            res.status(404).json({ success: false, message: 'Candidate not found' });
            return;
        }
        res.json({ success: true, data: candidate });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
exports.getCandidateById = getCandidateById;
// POST /api/admin/candidates
const createCandidate = async (req, res) => {
    try {
        const { name, email, password, phone, status, enrolledCourses, paymentDetails, performanceMetrics, batchRank, stipendEligible, skills } = req.body;
        const candidate = await Candidate_1.default.create({
            name,
            email,
            password,
            phone: phone || '',
            status: status || 'active',
            enrolledCourses: enrolledCourses || [],
            paymentDetails: paymentDetails || { paidAmount: 0, remainingAmount: 0 },
            performanceMetrics: performanceMetrics || { overallScore: 0, attendance: 0, progress: 0, averageScore: 0 },
            batchRank: batchRank || 'N/A',
            stipendEligible: stipendEligible || false,
            skills: skills || { tech: 0, softSkills: 0, blockchain: 0, smartContracts: 0, frontend: 0, ai: 0, systemDesign: 0 },
        });
        res.status(201).json({ success: true, data: candidate });
    }
    catch (error) {
        if (error instanceof Error && error.name === 'ValidationError') {
            res.status(400).json({ success: false, message: 'Validation error', error: error.message });
            return;
        }
        if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
            res.status(400).json({ success: false, message: 'Email already exists' });
            return;
        }
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
exports.createCandidate = createCandidate;
// PUT /api/admin/candidates/:id
const updateCandidate = async (req, res) => {
    try {
        const { password, ...updateData } = req.body;
        const candidate = await Candidate_1.default.findById(req.params.id);
        if (!candidate) {
            res.status(404).json({ success: false, message: 'Candidate not found' });
            return;
        }
        // Apply updates
        Object.assign(candidate, updateData);
        if (password)
            candidate.password = password;
        await candidate.save();
        const populated = await candidate.populate('enrolledCourses', 'title category status');
        res.json({ success: true, data: populated });
    }
    catch (error) {
        if (error instanceof Error && error.name === 'ValidationError') {
            res.status(400).json({ success: false, message: 'Validation error', error: error.message });
            return;
        }
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
exports.updateCandidate = updateCandidate;
// DELETE /api/admin/candidates/:id
const deleteCandidate = async (req, res) => {
    try {
        const candidate = await Candidate_1.default.findByIdAndDelete(req.params.id);
        if (!candidate) {
            res.status(404).json({ success: false, message: 'Candidate not found' });
            return;
        }
        res.json({ success: true, message: 'Candidate deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
exports.deleteCandidate = deleteCandidate;
// POST /api/admin/candidates/:id/assign-course
const assignCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        // Verify course exists
        const course = await Course_1.default.findById(courseId);
        if (!course) {
            res.status(404).json({ success: false, message: 'Course not found' });
            return;
        }
        const candidate = await Candidate_1.default.findById(req.params.id);
        if (!candidate) {
            res.status(404).json({ success: false, message: 'Candidate not found' });
            return;
        }
        // Check if already enrolled
        if (candidate.enrolledCourses.some((id) => id.toString() === courseId)) {
            res.status(400).json({ success: false, message: 'Candidate already enrolled in this course' });
            return;
        }
        candidate.enrolledCourses.push(courseId);
        await candidate.save();
        const populated = await candidate.populate('enrolledCourses', 'title category status');
        res.json({ success: true, data: populated });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
exports.assignCourse = assignCourse;
// POST /api/admin/candidates/:id/remove-course
const removeCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const candidate = await Candidate_1.default.findById(req.params.id);
        if (!candidate) {
            res.status(404).json({ success: false, message: 'Candidate not found' });
            return;
        }
        const courseIndex = candidate.enrolledCourses.findIndex((id) => id.toString() === courseId);
        if (courseIndex === -1) {
            res.status(400).json({ success: false, message: 'Candidate is not enrolled in this course' });
            return;
        }
        candidate.enrolledCourses.splice(courseIndex, 1);
        await candidate.save();
        const populated = await candidate.populate('enrolledCourses', 'title category status');
        res.json({ success: true, data: populated });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
exports.removeCourse = removeCourse;
// GET /api/admin/stats
const getDashboardStats = async (_req, res) => {
    try {
        const totalCourses = await Course_1.default.countDocuments();
        const activeCourses = await Course_1.default.countDocuments({ status: 'active' });
        const totalCandidates = await Candidate_1.default.countDocuments();
        const activeCandidates = await Candidate_1.default.countDocuments({ status: 'active' });
        const recentCourses = await Course_1.default.find().sort({ createdAt: -1 }).limit(5).select('title status createdAt');
        const recentCandidates = await Candidate_1.default.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name email status createdAt');
        res.json({
            success: true,
            data: {
                totalCourses,
                activeCourses,
                totalCandidates,
                activeCandidates,
                recentCourses,
                recentCandidates,
            },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
exports.getDashboardStats = getDashboardStats;
