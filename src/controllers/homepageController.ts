import { Request, Response } from 'express';
import Project from '../models/Project';
import Service from '../models/Service';
import SectionContent from '../models/SectionContent';
import Testimonial from '../models/Testimonial';
import PageModel from '../models/PageModel';

// @desc    Get all homepage data
// @route   GET /api/public/homepage
// @access  Public
export const getHomepageData = async (req: Request, res: Response) => {
    try {
        const [projects, services, contents, testimonials, homePage] = await Promise.all([
            Project.find().sort({ order: 1 }),
            Service.find().sort({ order: 1 }),
            SectionContent.find(),
            Testimonial.find().sort({ order: 1 }),
            PageModel.findOne({ name: 'Home' })
        ]);

        // Transform contents array into a nested object
        const contentMap: any = {};
        contents.forEach(c => {
            if (!contentMap[c.section]) contentMap[c.section] = {};
            contentMap[c.section][c.key] = c.value;
        });

        res.status(200).json({
            success: true,
            data: {
                projects,
                services,
                testimonials,
                content: contentMap,
                pageStructure: homePage?.sections || []
            }
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Admin handlers could be added here later for managing these sections
