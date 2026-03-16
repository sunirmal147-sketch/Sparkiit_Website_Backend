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

// --- NEW DOMAIN IMPORTS ---
import { getAllBadges, createBadge, updateBadge, deleteBadge } from '../controllers/badgeController';
import { getAllBlogs, createBlog, updateBlog, deleteBlog } from '../controllers/blogController';
import { getAllOrders, createOrder, updateOrder, deleteOrder } from '../controllers/orderController';
import { getAllCoupons, createCoupon, updateCoupon, deleteCoupon } from '../controllers/couponController';
import { getAllWithdrawals, createWithdrawal, updateWithdrawal, deleteWithdrawal } from '../controllers/withdrawalController';
import { getAllLocations, createLocation, updateLocation, deleteLocation } from '../controllers/locationController';
import { getAllBrands, createBrand, updateBrand, deleteBrand } from '../controllers/brandController';
import { getAllFooterSettings, createFooterSetting, updateFooterSetting, deleteFooterSetting } from '../controllers/footerSettingController';
import { getAllMenus, createMenu, updateMenu, deleteMenu } from '../controllers/menuController';
import { getAllPageModels, createPageModel, updatePageModel, deletePageModel } from '../controllers/pageModelController';
import { getAllSocialLinks, createSocialLink, updateSocialLink, deleteSocialLink } from '../controllers/socialLinkController';
import { getAllFaqs, createFaq, updateFaq, deleteFaq } from '../controllers/faqController';
import { getAllSettings, createSetting, updateSetting, deleteSetting } from '../controllers/settingController';
import { getAllBookings, updateBookingStatus, deleteBooking } from '../controllers/bookingController';

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

// --- NEW ENDPOINTS ---
// Badges
router.get('/badges', protect, getAllBadges);
router.post('/badges', protect, authorize('SUPER_ADMIN', 'ADMIN'), createBadge);
router.put('/badges/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), updateBadge);
router.delete('/badges/:id', protect, authorize('SUPER_ADMIN'), deleteBadge);

// Blogs
router.get('/blogs', protect, getAllBlogs);
router.post('/blogs', protect, authorize('SUPER_ADMIN', 'ADMIN'), createBlog);
router.put('/blogs/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), updateBlog);
router.delete('/blogs/:id', protect, authorize('SUPER_ADMIN'), deleteBlog);

// Orders
router.get('/orders', protect, getAllOrders);
router.post('/orders', protect, authorize('SUPER_ADMIN', 'ADMIN'), createOrder);
router.put('/orders/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), updateOrder);
router.delete('/orders/:id', protect, authorize('SUPER_ADMIN'), deleteOrder);

// Coupons
router.get('/coupons', protect, getAllCoupons);
router.post('/coupons', protect, authorize('SUPER_ADMIN', 'ADMIN'), createCoupon);
router.put('/coupons/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), updateCoupon);
router.delete('/coupons/:id', protect, authorize('SUPER_ADMIN'), deleteCoupon);

// Withdrawals
router.get('/withdrawals', protect, getAllWithdrawals);
router.post('/withdrawals', protect, authorize('SUPER_ADMIN', 'ADMIN'), createWithdrawal);
router.put('/withdrawals/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), updateWithdrawal);
router.delete('/withdrawals/:id', protect, authorize('SUPER_ADMIN'), deleteWithdrawal);

// Locations
router.get('/locations', protect, getAllLocations);
router.post('/locations', protect, authorize('SUPER_ADMIN', 'ADMIN'), createLocation);
router.put('/locations/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), updateLocation);
router.delete('/locations/:id', protect, authorize('SUPER_ADMIN'), deleteLocation);

// Brands
router.get('/brands', protect, getAllBrands);
router.post('/brands', protect, authorize('SUPER_ADMIN', 'ADMIN'), createBrand);
router.put('/brands/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), updateBrand);
router.delete('/brands/:id', protect, authorize('SUPER_ADMIN'), deleteBrand);

// FooterSettings
router.get('/footer-settings', protect, getAllFooterSettings);
router.post('/footer-settings', protect, authorize('SUPER_ADMIN', 'ADMIN'), createFooterSetting);
router.put('/footer-settings/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), updateFooterSetting);
router.delete('/footer-settings/:id', protect, authorize('SUPER_ADMIN'), deleteFooterSetting);

// Menus
router.get('/menus', protect, getAllMenus);
router.post('/menus', protect, authorize('SUPER_ADMIN', 'ADMIN'), createMenu);
router.put('/menus/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), updateMenu);
router.delete('/menus/:id', protect, authorize('SUPER_ADMIN'), deleteMenu);

// PageModels
router.get('/pages', protect, getAllPageModels);
router.post('/pages', protect, authorize('SUPER_ADMIN', 'ADMIN'), createPageModel);
router.put('/pages/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), updatePageModel);
router.delete('/pages/:id', protect, authorize('SUPER_ADMIN'), deletePageModel);

// SocialLinks
router.get('/social-links', protect, getAllSocialLinks);
router.post('/social-links', protect, authorize('SUPER_ADMIN', 'ADMIN'), createSocialLink);
router.put('/social-links/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), updateSocialLink);
router.delete('/social-links/:id', protect, authorize('SUPER_ADMIN'), deleteSocialLink);

// Faqs
router.get('/faqs', protect, getAllFaqs);
router.post('/faqs', protect, authorize('SUPER_ADMIN', 'ADMIN'), createFaq);
router.put('/faqs/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), updateFaq);
router.delete('/faqs/:id', protect, authorize('SUPER_ADMIN'), deleteFaq);

// Settings
router.get('/settings', protect, getAllSettings);
router.post('/settings', protect, authorize('SUPER_ADMIN', 'ADMIN'), createSetting);
router.put('/settings/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), updateSetting);
router.delete('/settings/:id', protect, authorize('SUPER_ADMIN'), deleteSetting);

// Bookings
router.get('/bookings', protect, getAllBookings);
router.put('/bookings/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), updateBookingStatus);
router.delete('/bookings/:id', protect, authorize('SUPER_ADMIN'), deleteBooking);

