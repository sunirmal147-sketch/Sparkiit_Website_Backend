import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Project from '../models/Project';
import Service from '../models/Service';
import SectionContent from '../models/SectionContent';

dotenv.config();

const projects = [
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
    },
    {
        num: "03",
        title: "DAO GOVERNANCE",
        category: "CRYPTO",
        image: "https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=2832&auto=format&fit=crop",
        order: 3
    },
    {
        num: "04",
        title: "WALLET APPS",
        category: "FINTECH",
        image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=2787&auto=format&fit=crop",
        order: 4
    }
];

const services = [
    { title: "Application Development", order: 1 },
    { title: "UI/UX Strategy & Design", order: 2 },
    { title: "Blockchain Solutions", order: 3 },
    { title: "Smart Contract Audit", order: 4 },
    { title: "Digital Marketing", order: 5 },
    { title: "Content Strategy", order: 6 }
];

const contents = [
    // Hero Section
    { section: 'hero', key: 'word1', value: 'IDEA' },
    { section: 'hero', key: 'word2', value: 'INNOVATE' },
    { section: 'hero', key: 'word3', value: 'TRANSFORM' },
    { section: 'hero', key: 'tagline', value: 'Design and development for Blockchain, DeFi, Web3, and Crypto Start-ups.' },
    { section: 'hero', key: 'ctaText', value: 'Let\'s Talk' },
    
    // Our Story Section
    { section: 'story', key: 'title', value: 'The journey of Sparkiit' },
    { section: 'story', key: 'subtitle', value: 'Since 2021, we have been at the forefront of digital innovation, helping brands navigate the complex landscape of Web3, Blockchain, and immersive technology.' },
    { section: 'story', key: 'description', value: 'Our mission is to empower visionaries with the tools and strategies needed to transform industries. We believe that technology should be a catalyst for change, not a barrier. By blending creative design with deep technical expertise, we create experiences that are not only beautiful but also functional and secure.' },

    // Working Process Section
    { section: 'process', key: 'title', value: 'WORKING PROCESS.' },
    { section: 'process', key: 'description', value: 'A systematic approach to turning complex ideas into seamless digital experiences.' },
    { section: 'process', key: 'step1Title', value: 'STRATEGY' },
    { section: 'process', key: 'step1Desc', value: 'We define the vision, goals, and core requirements to ensure a solid foundation for your project.' },
    { section: 'process', key: 'step2Title', value: 'DESIGN' },
    { section: 'process', key: 'step2Desc', value: 'Our creative team builds intuitive and visually stunning interfaces that prioritize user experience.' },
    { section: 'process', key: 'step3Title', value: 'DEVELOP' },
    { section: 'process', key: 'step3Desc', value: 'Scaleable, secure, and high-performance solutions built with modern technology stacks.' },

    // Site Settings
    { section: 'site', key: 'logoText', value: 'Sparkiit' },
    { section: 'site', key: 'footerDesc', value: 'Transforming the digital landscape through innovation, design, and deep technical expertise.' },
    { section: 'site', key: 'copyright', value: '© 2026 SPARKIIT AGENCY. ALL RIGHTS RESERVED.' },
    { section: 'site', key: 'github', value: 'https://github.com' },
    { section: 'site', key: 'twitter', value: 'https://twitter.com' },
    { section: 'site', key: 'linkedin', value: 'https://linkedin.com' },
    { section: 'site', key: 'instagram', value: 'https://instagram.com' }
];

const seedHomepage = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await Promise.all([
            Project.deleteMany({}),
            Service.deleteMany({}),
            SectionContent.deleteMany({})
        ]);
        console.log('🗑️  Cleared existing homepage data');

        // Seed new data
        await Promise.all([
            Project.insertMany(projects),
            Service.insertMany(services),
            SectionContent.insertMany(contents)
        ]);
        console.log('🌱 Seeded homepage data successfully');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
};

seedHomepage();
