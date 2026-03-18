import express from 'express';
import { getHomepageData } from '../controllers/homepageController';
import { validateCertificate } from '../controllers/certificateController';
import { getAllCourses } from '../controllers/courseController';
import { signup, login, getMe } from '../controllers/candidateAuthController';
import { createOrder, verifyPayment } from '../controllers/paymentController';
import { createBooking, getMyBookings } from '../controllers/bookingController';
import { getDashboardData, getStudentCertificates, getStudentTests, submitProject } from '../controllers/dashboardController';
import { protect } from '../middleware/authMiddleware';
import { getAllTestimonialsPublic } from '../controllers/testimonialController';

const router = express.Router();

router.get('/homepage', getHomepageData);
router.get('/validate-certificate', validateCertificate);
router.get('/courses', getAllCourses);
router.get('/testimonials', getAllTestimonialsPublic);

// Candidate Authentication
router.post('/auth/signup', signup);
router.post('/auth/login', login);
router.get('/auth/me', protect, getMe);

// Payments
router.post('/payments/create-order', protect, createOrder);
router.post('/payments/verify', protect, verifyPayment);

// Bookings
router.post('/bookings', protect, createBooking);
router.get('/bookings/my', protect, getMyBookings);

// Dashboard
router.get('/dashboard', protect, getDashboardData);
router.get('/dashboard/certificates', protect, getStudentCertificates);
router.get('/dashboard/tests', protect, getStudentTests);
router.post('/dashboard/projects/submit', protect, submitProject);

export default router;
