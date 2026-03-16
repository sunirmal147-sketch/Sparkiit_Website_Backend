import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Candidate from '../models/Candidate';

const generateToken = (id: string) => {
    return jwt.sign({ id, role: 'CANDIDATE' }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};

export const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, phone } = req.body;

        const candidateExists = await Candidate.findOne({ email });
        if (candidateExists) {
            res.status(400).json({ success: false, message: 'User already exists' });
            return;
        }

        const candidate = await Candidate.create({
            name,
            email,
            password,
            phone,
        });

        res.status(201).json({
            success: true,
            data: {
                _id: candidate._id,
                name: candidate.name,
                email: candidate.email,
                token: generateToken(candidate._id as string),
            },
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const candidate = await Candidate.findOne({ email }).select('+password');
        if (candidate && (await candidate.comparePassword(password))) {
            res.json({
                success: true,
                data: {
                    _id: candidate._id,
                    name: candidate.name,
                    email: candidate.email,
                    token: generateToken(candidate._id as string),
                },
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getMe = async (req: any, res: Response): Promise<void> => {
    try {
        const candidate = await Candidate.findById(req.user.id).populate('enrolledCourses');
        if (!candidate) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        res.json({ success: true, data: candidate });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
