import { Request, Response } from 'express';
import Certificate from '../models/Certificate';

// Public: Validate certificate by email
// GET /api/public/validate-certificate?email=...
export const validateCertificate = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.query;

        if (!email) {
            res.status(400).json({ success: false, message: 'Email is required' });
            return;
        }

        const certificates = await Certificate.find({ candidateEmail: (email as string).toLowerCase() })
            .sort({ issueDate: -1 });

        if (!certificates || certificates.length === 0) {
            res.status(404).json({ success: false, message: 'No certificates found for this email' });
            return;
        }

        res.json({ success: true, data: certificates });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

// Admin: Get all certificates
// GET /api/admin/certificates
export const getAllCertificates = async (req: Request, res: Response): Promise<void> => {
    try {
        const { search } = req.query;
        const filter: Record<string, any> = {};

        if (search) {
            filter.$or = [
                { candidateName: { $regex: search as string, $options: 'i' } },
                { candidateEmail: { $regex: search as string, $options: 'i' } },
                { certificateId: { $regex: search as string, $options: 'i' } },
                { courseName: { $regex: search as string, $options: 'i' } },
            ];
        }

        const certificates = await Certificate.find(filter).sort({ createdAt: -1 });
        res.json({ success: true, data: certificates, count: certificates.length });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

// Admin: Create certificate
// POST /api/admin/certificates
export const createCertificate = async (req: Request, res: Response): Promise<void> => {
    try {
        const { certificateId, candidateName, candidateEmail, courseName, issueDate, grade } = req.body;
        
        const certificate = await Certificate.create({
            certificateId,
            candidateName,
            candidateEmail,
            courseName,
            issueDate: issueDate || new Date(),
            grade,
        });

        res.status(201).json({ success: true, data: certificate });
    } catch (error: any) {
        if (error.name === 'ValidationError') {
            res.status(400).json({ success: false, message: 'Validation error', error: error.message });
            return;
        }
        if (error.code === 11000) {
            res.status(400).json({ success: false, message: 'Certificate ID already exists' });
            return;
        }
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

// Admin: Delete certificate
// DELETE /api/admin/certificates/:id
export const deleteCertificate = async (req: Request, res: Response): Promise<void> => {
    try {
        const certificate = await Certificate.findByIdAndDelete(req.params.id);
        if (!certificate) {
            res.status(404).json({ success: false, message: 'Certificate not found' });
            return;
        }
        res.json({ success: true, message: 'Certificate deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
