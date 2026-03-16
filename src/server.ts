import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import apiRoutes from './routes/api';
import adminRoutes from './routes/adminRoutes';
import publicRoutes from './routes/publicRoutes';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
