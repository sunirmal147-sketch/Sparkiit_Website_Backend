import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Certificate from '../models/Certificate';

dotenv.config();

const certificates = [
    {
        certificateId: "SPK-2026-001",
        candidateName: "John Doe",
        candidateEmail: "john@example.com",
        courseName: "Full Stack Web Development",
        issueDate: new Date("2026-01-15"),
        grade: "A+"
    },
    {
        certificateId: "SPK-2026-002",
        candidateName: "John Doe",
        candidateEmail: "john@example.com",
        courseName: "Blockchain Fundamentals",
        issueDate: new Date("2026-02-20"),
        grade: "A"
    },
    {
        certificateId: "SPK-2026-003",
        candidateName: "Jane Smith",
        candidateEmail: "jane@example.com",
        courseName: "UI/UX Design Masterclass",
        issueDate: new Date("2026-03-01"),
        grade: "O"
    }
];

const seedCertificates = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in .env');
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing certificates
        await Certificate.deleteMany({});
        console.log('🗑️  Cleared existing certificates');

        // Seed new data
        await Certificate.insertMany(certificates);
        console.log('🌱 Seeded sample certificates successfully');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding certificates:', error);
        process.exit(1);
    }
};

seedCertificates();
