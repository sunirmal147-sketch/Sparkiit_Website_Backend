import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User from '../models/User';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const checkAndCreateAdmin = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) {
            console.error('❌ MONGODB_URI not found in .env');
            process.exit(1);
        }
        
        console.log(`🔍 Checking database: ${mongoURI}`);
        await mongoose.connect(mongoURI);
        
        const email = 'sunirmal147@gmail.com';
        const password = 'password123';
        
        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (user) {
            console.log(`✅ User found!`);
            console.log(`   - Email: ${user.email}`);
            console.log(`   - Role: ${user.role}`);
            console.log(`   - ID: ${user._id}`);
            
            const isMatch = await user.comparePassword(password);
            if (isMatch) {
                console.log(`✅ Password matches 'password123'`);
            } else {
                console.log(`❌ Password does NOT match 'password123'. Resetting it now...`);
                user.password = password;
                await user.save();
                console.log(`✅ Password reset to 'password123'`);
            }
        } else {
            console.log(`❌ User not found. Creating it now...`);
            await User.create({
                username: 'sunirmal',
                email: email,
                password: password,
                role: 'SUPER_ADMIN'
            });
            console.log(`✅ Admin user created successfully!`);
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

checkAndCreateAdmin();
