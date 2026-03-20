const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

const MentorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    photo: { type: String, required: true },
    order: { type: Number, default: 0 },
}, { timestamps: true });

const Mentor = mongoose.model('Mentor', MentorSchema);

const dummyMentors = [
    {
        name: "ALEX RIVERA",
        description: "Senior Full Stack Dev & AI Architect",
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2787&auto=format&fit=crop",
        order: 1
    },
    {
        name: "SARAH CHENG",
        description: "Blockchain Lead & Smart Contract Auditor",
        photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop",
        order: 2
    },
    {
        name: "MARCUS THORNE",
        description: "Cybersecurity Expert & Ethic Hacker",
        photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2787&auto=format&fit=crop",
        order: 3
    },
    {
        name: "ELENA VOSS",
        description: "UI/UX Director & Digital Product Designer",
        photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2864&auto=format&fit=crop",
        order: 4
    },
    {
        name: "DAVID PARK",
        description: "DevOps Specialist & Cloud Infrastructure Lead",
        photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2940&auto=format&fit=crop",
        order: 5
    }
];

async function seedMentors() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected!');

        console.log('Cleaning existing mentors...');
        await Mentor.deleteMany({});

        console.log('Seeding dummy mentors...');
        await Mentor.insertMany(dummyMentors);

        console.log('Success: Mentors seeded!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding mentors:', error);
        process.exit(1);
    }
}

seedMentors();
