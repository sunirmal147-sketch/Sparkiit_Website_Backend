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
import {
    getAllCertificates,
    createCertificate,
    deleteCertificate,
} from '../controllers/certificateController';
import {
    getAllContent,
    updateContentBatch,
    updateSingleContent,
} from '../controllers/contentController';
import {
    getAllProjectsAdmin,
    createProject,
    updateProject,
    deleteProject,
} from '../controllers/projectController';
import {
    getAllServicesAdmin,
    createService,
    updateService,
    deleteService,
} from '../controllers/serviceController';
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

// Certificate routes
router.get('/certificates', protect, getAllCertificates);
router.post('/certificates', protect, authorize('SUPER_ADMIN', 'ADMIN'), createCertificate);
router.delete('/certificates/:id', protect, authorize('SUPER_ADMIN'), deleteCertificate);

// CMS: Content Routes
router.get('/content', protect, getAllContent);
router.put('/content/batch', protect, authorize('SUPER_ADMIN', 'ADMIN'), updateContentBatch);
router.post('/content', protect, authorize('SUPER_ADMIN', 'ADMIN'), updateSingleContent);

// CMS: Project Routes
router.get('/projects', protect, getAllProjectsAdmin);
router.post('/projects', protect, authorize('SUPER_ADMIN', 'ADMIN'), createProject);
router.put('/projects/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), updateProject);
router.delete('/projects/:id', protect, authorize('SUPER_ADMIN'), deleteProject);

// CMS: Service Routes
router.get('/services', protect, getAllServicesAdmin);
router.post('/services', protect, authorize('SUPER_ADMIN', 'ADMIN'), createService);
router.put('/services/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), updateService);
router.delete('/services/:id', protect, authorize('SUPER_ADMIN'), deleteService);

export default router;

