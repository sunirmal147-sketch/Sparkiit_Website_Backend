"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const Certificate_1 = __importDefault(require("../models/Certificate"));
dotenv_1.default.config();
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
        await mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');
        // Clear existing certificates
        await Certificate_1.default.deleteMany({});
        console.log('🗑️  Cleared existing certificates');
        // Seed new data
        await Certificate_1.default.insertMany(certificates);
        console.log('🌱 Seeded sample certificates successfully');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error seeding certificates:', error);
        process.exit(1);
    }
};
seedCertificates();
