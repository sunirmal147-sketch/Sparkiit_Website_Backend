"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const User_1 = __importDefault(require("../models/User"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
const checkAndCreateAdmin = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) {
            console.error('❌ MONGODB_URI not found in .env');
            process.exit(1);
        }
        console.log(`🔍 Checking database: ${mongoURI}`);
        await mongoose_1.default.connect(mongoURI);
        const email = 'sunirmal147@gmail.com';
        const password = 'password123';
        const user = await User_1.default.findOne({ email: email.toLowerCase() });
        if (user) {
            console.log(`✅ User found!`);
            console.log(`   - Email: ${user.email}`);
            console.log(`   - Role: ${user.role}`);
            console.log(`   - ID: ${user._id}`);
            const isMatch = await user.comparePassword(password);
            if (isMatch) {
                console.log(`✅ Password matches 'password123'`);
            }
            else {
                console.log(`❌ Password does NOT match 'password123'. Resetting it now...`);
                user.password = password;
                await user.save();
                console.log(`✅ Password reset to 'password123'`);
            }
        }
        else {
            console.log(`❌ User not found. Creating it now...`);
            await User_1.default.create({
                username: 'sunirmal',
                email: email,
                password: password,
                role: 'SUPER_ADMIN'
            });
            console.log(`✅ Admin user created successfully!`);
        }
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};
checkAndCreateAdmin();
