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
// @desc    Get all homepage data
// @route   GET /api/public/homepage
// @access  Public
const getHomepageData = async (req, res) => {
    try {
        const [projects, services, contents, testimonials] = await Promise.all([
            Project_1.default.find().sort({ order: 1 }),
            Service_1.default.find().sort({ order: 1 }),
            SectionContent_1.default.find(),
            Testimonial_1.default.find().sort({ order: 1 })
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
                content: contentMap
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
