import { Request, Response } from 'express';
import Candidate from '../models/Candidate';
import Course from '../models/Course';

// GET /api/admin/candidates
export const getAllCandidates = async (req: Request, res: Response): Promise<void> => {
    try {
        const { search, status } = req.query;
        const filter: Record<string, unknown> = {};

        if (search) {
            filter.$or = [
                { name: { $regex: search as string, $options: 'i' } },
                { email: { $regex: search as string, $options: 'i' } },
            ];
        }
        if (status) filter.status = status;

        const candidates = await Candidate.find(filter)
            .populate('enrolledCourses', 'title category status')
            .sort({ createdAt: -1 });

        res.json({ success: true, data: candidates, count: candidates.length });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

// GET /api/admin/candidates/:id
export const getCandidateById = async (req: Request, res: Response): Promise<void> => {
    try {
        const candidate = await Candidate.findById(req.params.id).populate('enrolledCourses');
        if (!candidate) {
            res.status(404).json({ success: false, message: 'Candidate not found' });
            return;
        }
        res.json({ success: true, data: candidate });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

// POST /api/admin/candidates
export const createCandidate = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, phone, status, enrolledCourses, paymentDetails, performanceMetrics, batchRank, stipendEligible, skills } = req.body;
        const candidate = await Candidate.create({
            name,
            email,
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
    } catch (error: unknown) {
        if (error instanceof Error && error.name === 'ValidationError') {
            res.status(400).json({ success: false, message: 'Validation error', error: error.message });
            return;
        }
        if (error && typeof error === 'object' && 'code' in error && (error as { code: number }).code === 11000) {
            res.status(400).json({ success: false, message: 'Email already exists' });
            return;
        }
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

// PUT /api/admin/candidates/:id
export const updateCandidate = async (req: Request, res: Response): Promise<void> => {
    try {
        const { enrolledCourses, ...updateData } = req.body;
        const candidate = await Candidate.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        }).populate('enrolledCourses', 'title category status');

        if (!candidate) {
            res.status(404).json({ success: false, message: 'Candidate not found' });
            return;
        }
        res.json({ success: true, data: candidate });
    } catch (error: unknown) {
        if (error instanceof Error && error.name === 'ValidationError') {
            res.status(400).json({ success: false, message: 'Validation error', error: error.message });
            return;
        }
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

// DELETE /api/admin/candidates/:id
export const deleteCandidate = async (req: Request, res: Response): Promise<void> => {
    try {
        const candidate = await Candidate.findByIdAndDelete(req.params.id);
        if (!candidate) {
            res.status(404).json({ success: false, message: 'Candidate not found' });
            return;
        }
        res.json({ success: true, message: 'Candidate deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

// POST /api/admin/candidates/:id/assign-course
export const assignCourse = async (req: Request, res: Response): Promise<void> => {
    try {
        const { courseId } = req.body;

        // Verify course exists
        const course = await Course.findById(courseId);
        if (!course) {
            res.status(404).json({ success: false, message: 'Course not found' });
            return;
        }

        const candidate = await Candidate.findById(req.params.id);
        if (!candidate) {
            res.status(404).json({ success: false, message: 'Candidate not found' });
            return;
        }

        // Check if already enrolled
        if (candidate.enrolledCourses.some((id: any) => id.toString() === courseId)) {
            res.status(400).json({ success: false, message: 'Candidate already enrolled in this course' });
            return;
        }

        candidate.enrolledCourses.push(courseId);
        await candidate.save();

        const populated = await candidate.populate('enrolledCourses', 'title category status');
        res.json({ success: true, data: populated });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

// POST /api/admin/candidates/:id/remove-course
export const removeCourse = async (req: Request, res: Response): Promise<void> => {
    try {
        const { courseId } = req.body;

        const candidate = await Candidate.findById(req.params.id);
        if (!candidate) {
            res.status(404).json({ success: false, message: 'Candidate not found' });
            return;
        }

        const courseIndex = candidate.enrolledCourses.findIndex((id: any) => id.toString() === courseId);
        if (courseIndex === -1) {
            res.status(400).json({ success: false, message: 'Candidate is not enrolled in this course' });
            return;
        }

        candidate.enrolledCourses.splice(courseIndex, 1);
        await candidate.save();

        const populated = await candidate.populate('enrolledCourses', 'title category status');
        res.json({ success: true, data: populated });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

// GET /api/admin/stats
export const getDashboardStats = async (_req: Request, res: Response): Promise<void> => {
    try {
        const totalCourses = await Course.countDocuments();
        const activeCourses = await Course.countDocuments({ status: 'active' });
        const totalCandidates = await Candidate.countDocuments();
        const activeCandidates = await Candidate.countDocuments({ status: 'active' });

        const recentCourses = await Course.find().sort({ createdAt: -1 }).limit(5).select('title status createdAt');
        const recentCandidates = await Candidate.find()
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
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
