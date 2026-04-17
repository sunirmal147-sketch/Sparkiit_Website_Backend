import Certificate from '../models/Certificate';
import CertificateTemplate from '../models/CertificateTemplate';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

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
        const { search, courseName } = req.query;
        const filter: Record<string, any> = {};

        if (search) {
            filter.$or = [
                { candidateName: { $regex: search as string, $options: 'i' } },
                { candidateEmail: { $regex: search as string, $options: 'i' } },
                { certificateId: { $regex: search as string, $options: 'i' } },
                { courseName: { $regex: search as string, $options: 'i' } },
            ];
        }

        if (courseName) {
            filter.courseName = courseName;
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
        const { certificateId, candidateName, candidateEmail, courseName, issueDate, grade, templateId } = req.body;
        
        let finalPdfUrl = '';

        if (templateId) {
            const template = await CertificateTemplate.findById(templateId);
            if (template) {
                // Generate PDF
                const templatePath = path.join(process.cwd(), template.pdfUrl.startsWith('/') ? template.pdfUrl.slice(1) : template.pdfUrl);
                
                if (fs.existsSync(templatePath)) {
                    const pdfBuffer = fs.readFileSync(templatePath);
                    const pdfDoc = await PDFDocument.load(pdfBuffer);
                    const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
                    const pages = pdfDoc.getPages();
                    const firstPage = pages[0];
                    const { height } = firstPage.getSize();

                    // Overlay fields
                    for (const field of template.fields) {
                        let text = '';
                        if (field.key === 'candidateName') text = candidateName;
                        else if (field.key === 'courseName') text = courseName;
                        else if (field.key === 'certificateId') text = certificateId;
                        else if (field.key === 'issueDate') text = new Date(issueDate || Date.now()).toLocaleDateString();
                        else if (field.key === 'grade') text = grade || '';

                        if (text) {
                            // pdf-lib uses Y from bottom, we likely have Y from top from the builder
                            // Coordinate translation logic: 
                            // If builder shows Y from top, pdf-lib Y = height - builderY
                            firstPage.drawText(text, {
                                x: field.x,
                                y: height - field.y,
                                size: field.fontSize || 24,
                                font: helveticaFont,
                                color: rgb(0, 0, 0),
                            });
                        }
                    }

                    const pdfBytes = await pdfDoc.save();
                    const filename = `cert-${certificateId}-${Date.now()}.pdf`;
                    const outputDir = path.join(process.cwd(), 'uploads', 'issued');
                    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
                    
                    const outputPath = path.join(outputDir, filename);
                    fs.writeFileSync(outputPath, pdfBytes);
                    finalPdfUrl = `/uploads/issued/${filename}`;
                }
            }
        }

        const certificate = await Certificate.create({
            certificateId,
            candidateName,
            candidateEmail,
            courseName,
            issueDate: issueDate || new Date(),
            grade,
            templateId,
            finalPdfUrl
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
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Admin: Bulk Issue Certificates
// POST /api/admin/certificates/bulk
export const bulkCreateCertificates = async (req: Request, res: Response): Promise<void> => {
    try {
        const { certificates } = req.body; // Expecting array of { certificateId, candidateName, candidateEmail, courseName, issueDate, grade }
        
        if (!certificates || !Array.isArray(certificates)) {
            res.status(400).json({ success: false, message: 'Expected an array of certificates' });
            return;
        }

        const results = await Certificate.insertMany(certificates, { ordered: false });
        res.status(201).json({ success: true, count: results.length, data: results });
    } catch (error: any) {
        if (error.name === 'BulkWriteError' || error.code === 11000) {
            // Some succeeded, some failed (likely duplicate IDs)
            res.status(207).json({ 
                success: true, 
                message: 'Partial success. Some certificates might have failed due to duplicate IDs.',
                error: error.writeErrors ? error.writeErrors.map((e: any) => e.errmsg) : error.message 
            });
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
