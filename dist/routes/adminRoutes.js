"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const courseController_1 = require("../controllers/courseController");
const candidateController_1 = require("../controllers/candidateController");
const userController_1 = require("../controllers/userController");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Authentication
router.post('/login', authController_1.login);
router.post('/register', authMiddleware_1.protect, (0, authMiddleware_1.authorize)('SUPER_ADMIN'), authController_1.register);
// User Management (Super Admin only)
router.get('/users', authMiddleware_1.protect, (0, authMiddleware_1.authorize)('SUPER_ADMIN'), userController_1.getAllUsers);
router.put('/users/:id/role', authMiddleware_1.protect, (0, authMiddleware_1.authorize)('SUPER_ADMIN'), userController_1.updateUserRole);
router.delete('/users/:id', authMiddleware_1.protect, (0, authMiddleware_1.authorize)('SUPER_ADMIN'), userController_1.deleteUser);
// Dashboard stats
router.get('/stats', authMiddleware_1.protect, candidateController_1.getDashboardStats);
// Course routes
router.get('/courses', authMiddleware_1.protect, courseController_1.getAllCourses);
router.get('/courses/:id', authMiddleware_1.protect, courseController_1.getCourseById);
router.post('/courses', authMiddleware_1.protect, (0, authMiddleware_1.authorize)('SUPER_ADMIN', 'ADMIN'), courseController_1.createCourse);
router.put('/courses/:id', authMiddleware_1.protect, (0, authMiddleware_1.authorize)('SUPER_ADMIN', 'ADMIN'), courseController_1.updateCourse);
router.delete('/courses/:id', authMiddleware_1.protect, (0, authMiddleware_1.authorize)('SUPER_ADMIN'), courseController_1.deleteCourse);
// Candidate routes
router.get('/candidates', authMiddleware_1.protect, candidateController_1.getAllCandidates);
router.get('/candidates/:id', authMiddleware_1.protect, candidateController_1.getCandidateById);
router.post('/candidates', authMiddleware_1.protect, candidateController_1.createCandidate);
router.put('/candidates/:id', authMiddleware_1.protect, candidateController_1.updateCandidate);
router.delete('/candidates/:id', authMiddleware_1.protect, (0, authMiddleware_1.authorize)('SUPER_ADMIN'), candidateController_1.deleteCandidate);
// Course assignment routes
router.post('/candidates/:id/assign-course', authMiddleware_1.protect, candidateController_1.assignCourse);
router.post('/candidates/:id/remove-course', authMiddleware_1.protect, candidateController_1.removeCourse);
exports.default = router;
