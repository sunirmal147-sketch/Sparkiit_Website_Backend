import { Request, Response } from 'express';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import CertificateTemplate from '../models/CertificateTemplate';

/**
 * POST /api/admin/templates/upload
 * Handles PDF upload and returns dimensions
 */
export const uploadTemplatePDF = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ success: false, message: 'No file uploaded' });
            return;
        }

        const filePath = req.file.path;
        const pdfBuffer = fs.readFileSync(filePath);
        const pdfDoc = await PDFDocument.load(pdfBuffer);
        const pages = pdfDoc.getPages();
        const { width, height } = pages[0].getSize();

        // Convert path to URL format (assuming /uploads is served statically)
        const fileUrl = `/uploads/templates/${req.file.filename}`;

        res.json({
            success: true,
            data: {
                url: fileUrl,
                originalPath: filePath,
                filename: req.file.filename,
                width,
                height
            }
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * POST /api/admin/templates
 * Saves the template configuration
 */
export const createTemplate = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, type, pdfUrl, width, height, fields } = req.body;
        
        const template = await CertificateTemplate.create({
            name,
            type,
            pdfUrl,
            width,
            height,
            fields
        });

        res.status(201).json({ success: true, data: template });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * GET /api/admin/templates
 */
export const getAllTemplates = async (req: Request, res: Response): Promise<void> => {
    try {
        const templates = await CertificateTemplate.find().sort({ createdAt: -1 });
        res.json({ success: true, data: templates });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * DELETE /api/admin/templates/:id
 */
export const deleteTemplate = async (req: Request, res: Response): Promise<void> => {
    try {
        const template = await CertificateTemplate.findById(req.params.id);
        if (!template) {
            res.status(404).json({ success: false, message: 'Template not found' });
            return;
        }

        // Optional: delete actual file
        const filePath = path.join(process.cwd(), template.pdfUrl);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await template.deleteOne();
        res.json({ success: true, message: 'Template deleted' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
