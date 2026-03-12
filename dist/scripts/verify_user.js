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
const verifyUser = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sparkiit';
        console.log(`Connecting to: ${mongoURI}`);
        await mongoose_1.default.connect(mongoURI);
        console.log('✅ MongoDB connected successfully');
        const email = 'sunirmal147@gmail.com';
        const user = await User_1.default.findOne({ email });
        if (user) {
            console.log(`✅ User found: ${user.email}`);
            console.log(`Role: ${user.role}`);
            console.log(`Username: ${user.username}`);
        }
        else {
            console.log(`❌ User NOT found: ${email}`);
        }
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};
verifyUser();
