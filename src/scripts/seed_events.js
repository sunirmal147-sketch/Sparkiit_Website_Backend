const mongoose = require('mongoose');
require('dotenv').config();

const EventSchema = new mongoose.Schema({
    title: String,
    description: String,
    date: Date,
    location: String,
    image: String,
    type: String,
    link: String
});

const Event = mongoose.model('Event', EventSchema);

const events = [
    {
        title: "Global Tech Summit 2026",
        description: "Join industry leaders for a 3-day exploration of AI, Web3, and the future of education.",
        date: new Date('2026-03-25'),
        location: "Virtual & New York",
        image: "https://images.unsplash.com/photo-1540575861501-7ad0582373f3?q=80&w=2670&auto=format&fit=crop",
        type: "ongoing",
        link: "https://example.com"
    },
    {
        title: "Sparkiit Hackathon",
        description: "A 48-hour build-athon where students compete to create the most innovative educational tool.",
        date: new Date('2026-04-15'),
        location: "Silicon Valley Hub",
        image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2670&auto=format&fit=crop",
        type: "upcoming",
        link: "https://example.com"
    },
    {
        title: "Blockchain Workshop",
        description: "A deep dive into smart contracts and decentralized applications for beginners.",
        date: new Date('2026-05-10'),
        location: "London Office",
        image: "https://images.unsplash.com/photo-1516245834210-c4c142787335?q=80&w=2670&auto=format&fit=crop",
        type: "upcoming",
        link: "https://example.com"
    },
    {
        title: "Summer Coding Camp 2025",
        description: "Our annual camp where 500+ students learned full-stack development and cloud architecture.",
        date: new Date('2025-07-20'),
        location: "Los Angeles",
        image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2670&auto=format&fit=crop",
        type: "past",
        link: "https://example.com"
    },
    {
        title: "AI Ethics Seminar",
        description: "Discussing the moral implications of large language models in modern society.",
        date: new Date('2025-11-12'),
        location: "Berlin University",
        image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=2670&auto=format&fit=crop",
        type: "past",
        link: "https://example.com"
    }
];

async function seedEvents() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        await Event.deleteMany({});
        console.log('Cleared existing events');
        
        await Event.insertMany(events);
        console.log('Seeded events successfully');
        
        process.exit();
    } catch (error) {
        console.error('Error seeding events:', error);
        process.exit(1);
    }
}

seedEvents();
