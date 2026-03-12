import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

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

    const client = new MongoClient(uri, {
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
    } catch (error: any) {
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
