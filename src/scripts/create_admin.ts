import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User from '../models/User';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const createAdmin = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sparkiit';
        console.log(`Connecting to: ${mongoURI}`);

        await mongoose.connect(mongoURI);
        console.log('✅ MongoDB connected successfully');

        const userData = {
            username: 'sunirmal',
            email: 'sunirmal147@gmail.com',
            password: 'password123', // Changed to match frontend login requirement
            role: 'SUPER_ADMIN'
        };

        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            console.log(`⚠️ User ${userData.email} already exists.`);
            process.exit(0);
        }

        const user = await User.create(userData);
        console.log(`✅ Admin user created successfully: ${user.email}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

createAdmin();
