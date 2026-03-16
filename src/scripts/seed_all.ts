import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../models/Course';
import Blog from '../models/Blog';
import Faq from '../models/Faq';
import Project from '../models/Project';

dotenv.config();

const courses = [
    {
        title: "Full Stack Web Development",
        description: "Master modern web development with Next.js, React, and Node.js. Build real-world projects and graduate with a high-quality portfolio.",
        category: "Web Development",
        price: 4999,
        duration: "6 Months",
        status: "active",
        imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop"
    },
    {
        title: "UI/UX Design Masterclass",
        description: "Learn the art of creating stunning interfaces and seamless user experiences. From wireframing in Figma to advanced prototyping.",
        category: "Design",
        price: 3499,
        duration: "3 Months",
        status: "active",
        imageUrl: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=2070&auto=format&fit=crop"
    },
    {
        title: "Blockchain & Web3 Engineering",
        description: "Dive deep into Ethereum, Solidity, and DApp development. Understand the future of the decentralized web and smart contracts.",
        category: "Web3",
        price: 5999,
        duration: "4 Months",
        status: "active",
        imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2232&auto=format&fit=crop"
    },
    {
        title: "Advanced Data Science",
        description: "Unlock the power of data with Python, Pandas, and Machine Learning. Learn to derive insights and build predictive models.",
        category: "Data Science",
        price: 4500,
        duration: "5 Months",
        status: "active",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bbbda536ad37?q=80&w=2070&auto=format&fit=crop"
    }
];

const blogs = [
    {
        title: "The Future of Web Development in 2026",
        content: "Web development is evolving faster than ever. From AI-driven coding assistants to the rise of edge computing, here's what to expect...",
        author: "Sunirmal",
        category: "Tech Trends",
        imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop"
    },
    {
        title: "Why UI/UX Matters more than ever",
        content: "In a world full of apps, the ones that win are the ones that are easiest to use. Let's explore the fundamentals of design psychology.",
        author: "Aryam",
        category: "Design",
        imageUrl: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2128&auto=format&fit=crop"
    }
];

const faqs = [
    {
        question: "How do I enroll in a course?",
        answer: "Simply go to the Domains page, choose your course, click 'Buy Now', and follow the payment instructions."
    },
    {
        question: "Are there any prerequisites?",
        answer: "Most of our foundational courses require no prior experience. Advanced courses may list specific prerequisites in their description."
    }
];

const projects = [
    {
        num: "01",
        title: "Crypto Dashboard",
        category: "Blockchain",
        image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=2070&auto=format&fit=crop",
        order: 1
    },
    {
        num: "02",
        title: "E-Commerce App",
        category: "Web Development",
        image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop",
        order: 2
    }
];

const seedAll = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in .env');
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Courses
        await Course.deleteMany({});
        await Course.insertMany(courses);
        console.log('🌱 Seeded Courses');

        // Blogs
        await Blog.deleteMany({});
        await Blog.insertMany(blogs);
        console.log('🌱 Seeded Blogs');

        // FAQs
        await Faq.deleteMany({});
        await Faq.insertMany(faqs);
        console.log('🌱 Seeded FAQs');

        // Projects
        await Project.deleteMany({});
        await Project.insertMany(projects);
        console.log('🌱 Seeded Projects');

        console.log('✨ All dummy data seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedAll();
