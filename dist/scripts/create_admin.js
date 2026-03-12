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
const createAdmin = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sparkiit';
        console.log(`Connecting to: ${mongoURI}`);
        await mongoose_1.default.connect(mongoURI);
        console.log('✅ MongoDB connected successfully');
        const userData = {
            username: 'sunirmal',
            email: 'sunirmal147@gmail.com',
            password: '1234', // Changed to match frontend login requirement
            role: 'SUPER_ADMIN'
        };
        const existingUser = await User_1.default.findOne({ email: userData.email });
        if (existingUser) {
            console.log(`⚠️ User ${userData.email} already exists.`);
            process.exit(0);
        }
        const user = await User_1.default.create(userData);
        console.log(`✅ Admin user created successfully: ${user.email}`);
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};
createAdmin();
