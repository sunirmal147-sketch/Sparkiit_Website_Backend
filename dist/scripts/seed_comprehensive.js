"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Import all models
const Badge_1 = __importDefault(require("../models/Badge"));
const Blog_1 = __importDefault(require("../models/Blog"));
const Booking_1 = __importDefault(require("../models/Booking"));
const Brand_1 = __importDefault(require("../models/Brand"));
const Candidate_1 = __importDefault(require("../models/Candidate"));
const Certificate_1 = __importDefault(require("../models/Certificate"));
const Coupon_1 = __importDefault(require("../models/Coupon"));
const Course_1 = __importDefault(require("../models/Course"));
const Faq_1 = __importDefault(require("../models/Faq"));
const FooterSetting_1 = __importDefault(require("../models/FooterSetting"));
const Location_1 = __importDefault(require("../models/Location"));
const Menu_1 = __importDefault(require("../models/Menu"));
const Order_1 = __importDefault(require("../models/Order"));
const PageModel_1 = __importDefault(require("../models/PageModel"));
const Project_1 = __importDefault(require("../models/Project"));
const SectionContent_1 = __importDefault(require("../models/SectionContent"));
const Service_1 = __importDefault(require("../models/Service"));
const Setting_1 = __importDefault(require("../models/Setting"));
const SocialLink_1 = __importDefault(require("../models/SocialLink"));
const Submission_1 = __importDefault(require("../models/Submission"));
const Test_1 = __importDefault(require("../models/Test"));
const User_1 = __importDefault(require("../models/User"));
const Withdrawal_1 = __importDefault(require("../models/Withdrawal"));
dotenv_1.default.config();
const clearDatabase = async () => {
    const models = [
        Badge_1.default, Blog_1.default, Booking_1.default, Brand_1.default, Candidate_1.default, Certificate_1.default, Coupon_1.default, Course_1.default,
        Faq_1.default, FooterSetting_1.default, Location_1.default, Menu_1.default, Order_1.default, PageModel_1.default, Project_1.default,
        SectionContent_1.default, Service_1.default, Setting_1.default, SocialLink_1.default, Submission_1.default, Test_1.default, User_1.default, Withdrawal_1.default
    ];
    for (const model of models) {
        await model.deleteMany({});
        console.log(`🗑️  Cleared ${model.modelName}`);
    }
};
const seedData = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in .env');
        }
        await mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');
        await clearDatabase();
        // 1. Users
        const salt = await bcryptjs_1.default.genSalt(10);
        const password = await bcryptjs_1.default.hash('password123', salt);
        const users = await User_1.default.insertMany([
            { username: 'admin', email: 'admin@sparkiit.com', password, role: 'SUPER_ADMIN' },
            { username: 'editor', email: 'editor@sparkiit.com', password, role: 'ADMIN' }
        ]);
        console.log('🌱 Seeded Users');
        // 2. Simple 'name' only models
        const nameModels = [
            { model: Badge_1.default, names: ['Premium', 'Certified', 'Expert'] },
            { model: Brand_1.default, names: ['Sparkiit', 'TechFlow', 'OpenAI'] },
            { model: Coupon_1.default, names: ['WELCOME10', 'SPARKIIT20', 'FLASH50'] },
            { model: FooterSetting_1.default, names: ['Default Footer', 'Dark Mode Footer'] },
            { model: Location_1.default, names: ['San Francisco, CA', 'New York, NY', 'Bangalore, India'] },
            { model: Menu_1.default, names: ['Main Menu', 'Footer Menu', 'Mobile Menu'] },
            { model: Setting_1.default, names: ['Global Theme', 'API Config'] },
            { model: SocialLink_1.default, names: ['https://github.com/sparkiit', 'https://twitter.com/sparkiit'] },
            { model: Withdrawal_1.default, names: ['PAYPAL_01', 'STRIPE_02'] },
            { model: PageModel_1.default, names: ['Home', 'About', 'Contact', 'Services'] }
        ];
        for (const item of nameModels) {
            await item.model.insertMany(item.names.map(name => ({ name })));
            console.log(`🌱 Seeded ${item.model.modelName}`);
        }
        // 3. Courses
        const courses = await Course_1.default.insertMany([
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
        const candidates = await Candidate_1.default.insertMany([
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
        await Blog_1.default.insertMany([
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
        await Faq_1.default.insertMany([
            { question: "How do I enroll?", answer: "Go to domains and click buy now." }
        ]);
        console.log('🌱 Seeded FAQs');
        // 7. Projects
        const projects = await Project_1.default.insertMany([
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
        await Service_1.default.insertMany([
            { title: "Application Development", order: 1 },
            { title: "UI/UX Strategy & Design", order: 2 }
        ]);
        console.log('🌱 Seeded Services');
        // 9. SectionContent
        await SectionContent_1.default.insertMany([
            { section: 'hero', key: 'word1', value: 'IDEA' },
            { section: 'hero', key: 'word2', value: 'INNOVATE' },
            { section: 'hero', key: 'word3', value: 'TRANSFORM' },
            { section: 'hero', key: 'tagline', value: 'Design and development for Blockchain, DeFi, Web3, and Crypto Start-ups.' },
            { section: 'site', key: 'logoText', value: 'Sparkiit' }
        ]);
        console.log('🌱 Seeded SectionContent');
        // 10. Relational Models (Orders, Bookings, Certificates, Submissions, Tests)
        // Orders
        await Order_1.default.insertMany([
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
        await Booking_1.default.insertMany([
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
        await Certificate_1.default.insertMany([
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
        const tests = await Test_1.default.insertMany([
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
        await Submission_1.default.insertMany([
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
    }
    catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};
seedData();
