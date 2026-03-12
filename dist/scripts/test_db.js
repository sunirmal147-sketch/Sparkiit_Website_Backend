"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const testConnection = async () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('ERROR: MONGODB_URI is not defined in .env');
        process.exit(1);
    }
    // Obfuscate URI for logging
    const obfuscatedUri = uri.replace(/:([^@:]+)@/, ':****@');
    console.log('Testing Connection with Native Driver...');
    console.log('URI:', obfuscatedUri);
    const client = new mongodb_1.MongoClient(uri, {
        serverSelectionTimeoutMS: 5000,
    });
    try {
        await client.connect();
        console.log('✅ SUCCESS: Native driver connected to MongoDB Atlas!');
        const db = client.db();
        const buildInfo = await db.command({ buildInfo: 1 });
        console.log('Server Version:', buildInfo.version);
        await client.close();
        process.exit(0);
    }
    catch (error) {
        console.error('❌ FAILURE:', error.message);
        if (error.message.includes('Authentication failed') || error.message.includes('bad auth')) {
            console.log('\n--- DIAGNOSIS ---');
            console.log('The server rejected your credentials.');
            console.log('1. Check if the password in .env is correct.');
            console.log('2. Check if the username in .env is correct.');
            console.log('3. Ensure 0.0.0.0/0 is whitelisted in Atlas (Network Access).');
        }
        process.exit(1);
    }
};
testConnection();
