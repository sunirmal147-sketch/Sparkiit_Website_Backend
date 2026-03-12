import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User from '../models/User';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const verifyUser = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sparkiit';
        console.log(`Connecting to: ${mongoURI}`);
        
        await mongoose.connect(mongoURI);
        console.log('✅ MongoDB connected successfully');

        const email = 'sunirmal147@gmail.com';
        const user = await User.findOne({ email });

        if (user) {
            console.log(`✅ User found: ${user.email}`);
            console.log(`Role: ${user.role}`);
            console.log(`Username: ${user.username}`);
        } else {
            console.log(`❌ User NOT found: ${email}`);
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

verifyUser();
