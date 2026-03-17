import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import apiRoutes from './routes/api';
import adminRoutes from './routes/adminRoutes';
import publicRoutes from './routes/publicRoutes';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'sparkiit_default_secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.SESSION_MONGODB_URI || process.env.MONGODB_URI,
        collectionName: 'sessions',
        ttl: 14 * 24 * 60 * 60 // 14 days
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
        sameSite: 'lax'
    }
}));

app.use('/api', apiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);

// ratelimmiter

app.get('/', (req: Request, res: Response) => {
    res.send('Edutech Backend Service is running!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
