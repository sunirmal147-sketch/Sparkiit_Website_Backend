import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Import all models
import Badge from '../models/Badge';
import Blog from '../models/Blog';
import Booking from '../models/Booking';
import Brand from '../models/Brand';
import Candidate from '../models/Candidate';
import Certificate from '../models/Certificate';
import Coupon from '../models/Coupon';
import Course from '../models/Course';
import Faq from '../models/Faq';
import FooterSetting from '../models/FooterSetting';
import Location from '../models/Location';
import Menu from '../models/Menu';
import Order from '../models/Order';
import PageModel from '../models/PageModel';
import Project from '../models/Project';
import SectionContent from '../models/SectionContent';
import Service from '../models/Service';
import Setting from '../models/Setting';
import SocialLink from '../models/SocialLink';
import Submission from '../models/Submission';
import Test from '../models/Test';
import User from '../models/User';
import Withdrawal from '../models/Withdrawal';

dotenv.config();

const clearDatabase = async () => {
    const models = [
        Badge, Blog, Booking, Brand, Candidate, Certificate, Coupon, Course,
        Faq, FooterSetting, Location, Menu, Order, PageModel, Project,
        SectionContent, Service, Setting, SocialLink, Submission, Test, User, Withdrawal
    ];
    
    for (const model of models) {
        await (model as any).deleteMany({});
        console.log(`🗑️  Cleared ${(model as any).modelName}`);
    }
};

const seedData = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in .env');
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        await clearDatabase();

        // 1. Users
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash('password123', salt);
        
        const users = await User.insertMany([
            { username: 'admin', email: 'admin@sparkiit.com', password, role: 'SUPER_ADMIN' },
            { username: 'editor', email: 'editor@sparkiit.com', password, role: 'ADMIN' }
        ]);
        console.log('🌱 Seeded Users');

        // 2. Simple 'name' only models
        const nameModels = [
            { model: Badge, names: ['Premium', 'Certified', 'Expert'] },
            { model: Brand, names: ['Sparkiit', 'TechFlow', 'OpenAI'] },
            { model: Coupon, names: ['WELCOME10', 'SPARKIIT20', 'FLASH50'] },
            { model: FooterSetting, names: ['Default Footer', 'Dark Mode Footer'] },
            { model: Location, names: ['San Francisco, CA', 'New York, NY', 'Bangalore, India'] },
            { model: Menu, names: ['Main Menu', 'Footer Menu', 'Mobile Menu'] },
            { model: Setting, names: ['Global Theme', 'API Config'] },
            { model: SocialLink, names: ['https://github.com/sparkiit', 'https://twitter.com/sparkiit'] },
            { model: Withdrawal, names: ['PAYPAL_01', 'STRIPE_02'] },
            { model: PageModel, names: ['Home', 'About', 'Contact', 'Services'] }
        ];

        for (const item of nameModels) {
            if (item.model === PageModel) {
                const homeSections = [
                    { name: 'HeroSection', enabled: true, order: 1 },
                    { name: 'Marquee', enabled: true, order: 2 },
                    { name: 'HorizontalScroll', enabled: true, order: 3 },
                    { name: 'ServicesOverview', enabled: true, order: 4 },
                    { name: 'Collaborations', enabled: true, order: 5 },
                    { name: 'OurStory', enabled: true, order: 6 },
                    { name: 'Colleges', enabled: true, order: 7 },
                    { name: 'ReviewSection', enabled: true, order: 8 },
                    { name: 'WorkingProcess', enabled: true, order: 9 },
                    { name: 'LatestProjects', enabled: true, order: 10 },
                    { name: 'ParallaxImage', enabled: true, order: 11 },
                    { name: 'CompanyInsights', enabled: true, order: 12 },
                    { name: 'RoadmapSection', enabled: true, order: 13 },
                    { name: 'FeaturedIn', enabled: true, order: 14 },
                    { name: 'Testimonials', enabled: true, order: 15 },
                    { name: 'MentorsSection', enabled: true, order: 16 }
                ];
                await PageModel.insertMany(item.names.map(name => ({ 
                    name, 
                    sections: name === 'Home' ? homeSections : [] 
                })));
            } else {
                await item.model.insertMany(item.names.map(name => ({ name })));
            }
            console.log(`🌱 Seeded ${item.model.modelName}`);
        }

        // 3. Courses
        const courses = await Course.insertMany([
            {
                title: "Full Stack Web Development",
                description: "Master modern web development with Next.js, React, and Node.js.",
                category: "Web Development",
                price: 4999,
                duration: "6 Months",
                status: "active",
                imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop"
            },
            {
                title: "UI/UX Design Masterclass",
                description: "Learn the art of creating stunning interfaces.",
                category: "Design",
                price: 3499,
                duration: "3 Months",
                status: "active",
                imageUrl: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=2070&auto=format&fit=crop"
            }
        ]);
        console.log('🌱 Seeded Courses');

        // 4. Candidates
        const candidates = await Candidate.insertMany([
            {
                name: "John Doe",
                email: "john@example.com",
                phone: "1234567890",
                status: "active",
                enrolledCourses: [courses[0]._id]
            },
            {
                name: "Jane Smith",
                email: "jane@example.com",
                phone: "9876543210",
                status: "active",
                enrolledCourses: [courses[1]._id]
            }
        ]);
        console.log('🌱 Seeded Candidates');

        // 5. Blogs
        await Blog.insertMany([
            {
                title: "The Future of Web Development in 2026",
                content: "Web development is evolving faster than ever...",
                author: "Admin",
                category: "Tech Trends",
                imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop"
            }
        ]);
        console.log('🌱 Seeded Blogs');

        // 6. FAQs
        await Faq.insertMany([
            { question: "How do I enroll?", answer: "Go to domains and click buy now." }
        ]);
        console.log('🌱 Seeded FAQs');

        // 7. Projects
        const projects = await Project.insertMany([
            {
                num: "01",
                title: "DEX PROTOCOL",
                category: "BLOCKCHAIN",
                image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop",
                order: 1
            },
            {
                num: "02",
                title: "NFT MARKETPLACE",
                category: "WEB3",
                image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2874&auto=format&fit=crop",
                order: 2
            }
        ]);
        console.log('🌱 Seeded Projects');

        // 8. Services
        await Service.insertMany([
            { title: "Application Development", order: 1 },
            { title: "UI/UX Strategy & Design", order: 2 }
        ]);
        console.log('🌱 Seeded Services');

        // 9. SectionContent
        await SectionContent.insertMany([
            { section: 'hero', key: 'word1', value: 'IDEA' },
            { section: 'hero', key: 'word2', value: 'INNOVATE' },
            { section: 'hero', key: 'word3', value: 'TRANSFORM' },
            { section: 'hero', key: 'tagline', value: 'Design and development for Blockchain, DeFi, Web3, and Crypto Start-ups.' },
            { section: 'site', key: 'logoText', value: 'Sparkiit' }
        ]);
        console.log('🌱 Seeded SectionContent');

        // 10. Relational Models (Orders, Bookings, Certificates, Submissions, Tests)
        
        // Orders
        await Order.insertMany([
            {
                candidate: candidates[0]._id,
                course: courses[0]._id,
                amount: 4999,
                razorpay_order_id: "order_123456",
                status: "success"
            }
        ]);
        console.log('🌱 Seeded Orders');

        // Bookings
        await Booking.insertMany([
            {
                candidate: candidates[0]._id,
                course: courses[0]._id,
                slotDate: new Date(),
                slotTime: "10:00 AM",
                status: "confirmed"
            }
        ]);
        console.log('🌱 Seeded Bookings');

        // Certificates
        await Certificate.insertMany([
            {
                certificateId: "SPK-2026-001",
                candidateName: candidates[0].name,
                candidateEmail: candidates[0].email,
                courseName: courses[0].title,
                issueDate: new Date(),
                grade: "A+"
            }
        ]);
        console.log('🌱 Seeded Certificates');

        // Tests
        const tests = await Test.insertMany([
            {
                title: "React Fundamentals",
                courseId: courses[0]._id,
                questions: [
                    { question: "What is JSX?", options: ["Syntax extension", "Style sheet", "Database"], correctAnswer: 0 }
                ],
                duration: 30,
                category: "Frontend"
            }
        ]);
        console.log('🌱 Seeded Tests');

        // Submissions
        await Submission.insertMany([
            {
                candidateId: candidates[0]._id,
                projectId: projects[0]._id,
                repoUrl: "https://github.com/johndoe/crypto-dash",
                status: "pending"
            }
        ]);
        console.log('🌱 Seeded Submissions');

        console.log('✨ All dummy data seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedData();
