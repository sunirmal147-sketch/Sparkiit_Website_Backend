import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import Project from '../models/Project';
import Service from '../models/Service';
import SectionContent from '../models/SectionContent';
import Testimonial from '../models/Testimonial';
import PageModel from '../models/PageModel';
import Blog from '../models/Blog';
import Event from '../models/Event';
import Mentor from '../models/Mentor';
import Brand from '../models/Brand';
import SocialLink from '../models/SocialLink';
import Faq from '../models/Faq';
import FooterSetting from '../models/FooterSetting';
import Menu from '../models/Menu';
import Setting from '../models/Setting';

// @desc    Get all homepage data
// @route   GET /api/public/homepage
// @access  Public
export const getHomepageData = async (req: ExpressRequest, res: ExpressResponse) => {
    try {
        const [
            projects, 
            services, 
            contents, 
            testimonials, 
            homePage,
            blogs,
            events,
            mentors,
            brands,
            socialLinks,
            faqs,
            footerSettings,
            menus,
            settings
        ] = await Promise.all([
            Project.find().sort({ order: 1 }),
            Service.find().sort({ order: 1 }),
            SectionContent.find(),
            Testimonial.find().sort({ order: 1 }),
            PageModel.findOne({ name: 'Home' }),
            Blog.find().sort({ createdAt: -1 }).limit(6),
            Event.find().sort({ date: 1 }),
            Mentor.find().sort({ order: 1 }),
            Brand.find().sort({ order: 1 }),
            SocialLink.find().sort({ order: 1 }),
            Faq.find().sort({ order: 1 }),
            FooterSetting.find(),
            Menu.find().sort({ order: 1 }),
            Setting.find({ group: 'contact_page' })
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
                blogs,
                events,
                mentors,
                brands,
                socialLinks,
                faqs,
                footerSettings,
                menus,
                content: contentMap,
                settings: settings.reduce((acc: any, s: any) => ({ ...acc, [s.key]: s.value }), {}),
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
