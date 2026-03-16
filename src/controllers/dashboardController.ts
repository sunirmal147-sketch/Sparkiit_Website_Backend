import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Candidate from '../models/Candidate';
import Course from '../models/Course';
import Certificate from '../models/Certificate';
import Test from '../models/Test';
import Submission from '../models/Submission';

// @desc    Get student dashboard data
// @route   GET /api/public/dashboard
// @access  Private/Candidate
export const getDashboardData = asyncHandler(async (req: Request, res: Response) => {
    const candidate = await Candidate.findById(req.user?._id).populate('enrolledCourses');

    if (!candidate) {
        res.status(404);
        throw new Error('Candidate not found');
    }

    res.json({
        stats: candidate.performanceMetrics,
        enrolledCourses: candidate.enrolledCourses,
        tests: candidate.completedTests,
        projects: candidate.submittedProjects,
    });
});

// @desc    Get student certificates
// @route   GET /api/public/dashboard/certificates
// @access  Private/Candidate
export const getStudentCertificates = asyncHandler(async (req: Request, res: Response) => {
    const certificates = await Certificate.find({ candidateEmail: req.user?.email });
    res.json(certificates);
});

// @desc    Get available tests for enrolled courses
// @route   GET /api/public/dashboard/tests
// @access  Private/Candidate
export const getStudentTests = asyncHandler(async (req: Request, res: Response) => {
    const candidate = await Candidate.findById(req.user?._id);
    if (!candidate) {
        res.status(404);
        throw new Error('Candidate not found');
    }

    const tests = await Test.find({ courseId: { $in: candidate.enrolledCourses } });
    res.json(tests);
});

// @desc    Submit a project
// @route   POST /api/public/dashboard/projects/submit
// @access  Private/Candidate
export const submitProject = asyncHandler(async (req: Request, res: Response) => {
    const { projectId, repoUrl } = req.body;

    const submission = await Submission.create({
        candidateId: req.user?._id,
        projectId,
        repoUrl,
    });

    // Update candidate's submittedProjects array
    await Candidate.findByIdAndUpdate(req.user?._id, {
        $push: {
            submittedProjects: {
                projectId,
                repoUrl,
                status: 'pending',
                date: new Date(),
            },
        },
    });

    res.status(201).json(submission);
});
