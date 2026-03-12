import { Router } from 'express';
import {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
} from '../controllers/courseController';
import {
    getAllCandidates,
    getCandidateById,
    createCandidate,
    updateCandidate,
    deleteCandidate,
    assignCourse,
    removeCourse,
    getDashboardStats,
} from '../controllers/candidateController';
import {
    getAllUsers,
    deleteUser,
    updateUserRole,
} from '../controllers/userController';
import { login, register } from '../controllers/authController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

// Authentication
router.post('/login', login);
router.post('/register', protect, authorize('SUPER_ADMIN'), register);

// User Management (Super Admin only)
router.get('/users', protect, authorize('SUPER_ADMIN'), getAllUsers);
router.put('/users/:id/role', protect, authorize('SUPER_ADMIN'), updateUserRole);
router.delete('/users/:id', protect, authorize('SUPER_ADMIN'), deleteUser);


// Dashboard stats
router.get('/stats', protect, getDashboardStats);

// Course routes
router.get('/courses', protect, getAllCourses);
router.get('/courses/:id', protect, getCourseById);
router.post('/courses', protect, authorize('SUPER_ADMIN', 'ADMIN'), createCourse);
router.put('/courses/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), updateCourse);
router.delete('/courses/:id', protect, authorize('SUPER_ADMIN'), deleteCourse);

// Candidate routes
router.get('/candidates', protect, getAllCandidates);
router.get('/candidates/:id', protect, getCandidateById);
router.post('/candidates', protect, createCandidate);
router.put('/candidates/:id', protect, updateCandidate);
router.delete('/candidates/:id', protect, authorize('SUPER_ADMIN'), deleteCandidate);

// Course assignment routes
router.post('/candidates/:id/assign-course', protect, assignCourse);
router.post('/candidates/:id/remove-course', protect, removeCourse);

export default router;

