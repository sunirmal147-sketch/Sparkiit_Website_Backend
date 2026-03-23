"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHomepageData = void 0;
const Project_1 = __importDefault(require("../models/Project"));
const Service_1 = __importDefault(require("../models/Service"));
const SectionContent_1 = __importDefault(require("../models/SectionContent"));
const Testimonial_1 = __importDefault(require("../models/Testimonial"));
const PageModel_1 = __importDefault(require("../models/PageModel"));
const Blog_1 = __importDefault(require("../models/Blog"));
const Event_1 = __importDefault(require("../models/Event"));
const Mentor_1 = __importDefault(require("../models/Mentor"));
const Brand_1 = __importDefault(require("../models/Brand"));
const SocialLink_1 = __importDefault(require("../models/SocialLink"));
const Faq_1 = __importDefault(require("../models/Faq"));
const FooterSetting_1 = __importDefault(require("../models/FooterSetting"));
const Menu_1 = __importDefault(require("../models/Menu"));
// @desc    Get all homepage data
// @route   GET /api/public/homepage
// @access  Public
const getHomepageData = async (req, res) => {
    try {
        const [projects, services, contents, testimonials, homePage, blogs, events, mentors, brands, socialLinks, faqs, footerSettings, menus] = await Promise.all([
            Project_1.default.find().sort({ order: 1 }),
            Service_1.default.find().sort({ order: 1 }),
            SectionContent_1.default.find(),
            Testimonial_1.default.find().sort({ order: 1 }),
            PageModel_1.default.findOne({ name: 'Home' }),
            Blog_1.default.find().sort({ createdAt: -1 }).limit(6),
            Event_1.default.find().sort({ date: 1 }),
            Mentor_1.default.find().sort({ order: 1 }),
            Brand_1.default.find().sort({ order: 1 }),
            SocialLink_1.default.find().sort({ order: 1 }),
            Faq_1.default.find().sort({ order: 1 }),
            FooterSetting_1.default.find(),
            Menu_1.default.find().sort({ order: 1 })
        ]);
        // Transform contents array into a nested object
        const contentMap = {};
        contents.forEach(c => {
            if (!contentMap[c.section])
                contentMap[c.section] = {};
            contentMap[c.section][c.key] = c.value;
        });
        res.status(200).json({
            success: true,
            data: {
                projects,
                services,
                testimonials,
                blogs,
                events,
                mentors,
                brands,
                socialLinks,
                faqs,
                footerSettings,
                menus,
                content: contentMap,
                pageStructure: homePage?.sections || []
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};
exports.getHomepageData = getHomepageData;
// Admin handlers could be added here later for managing these sections
