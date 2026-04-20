"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCertificate = exports.bulkCreateCertificates = exports.createCertificate = exports.getAllCertificates = exports.validateCertificate = void 0;
const Certificate_1 = __importDefault(require("../models/Certificate"));
const CertificateTemplate_1 = __importDefault(require("../models/CertificateTemplate"));
const pdf_lib_1 = require("pdf-lib");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Public: Validate certificate by email
// GET /api/public/validate-certificate?email=...
const validateCertificate = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            res.status(400).json({ success: false, message: 'Email is required' });
            return;
        }
        const certificates = await Certificate_1.default.find({ candidateEmail: email.toLowerCase() })
            .sort({ issueDate: -1 });
        if (!certificates || certificates.length === 0) {
            res.status(404).json({ success: false, message: 'No certificates found for this email' });
            return;
        }
        res.json({ success: true, data: certificates });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
exports.validateCertificate = validateCertificate;
// Admin: Get all certificates
// GET /api/admin/certificates
const getAllCertificates = async (req, res) => {
    try {
        const { search, courseName } = req.query;
        const filter = {};
        if (search) {
            filter.$or = [
                { candidateName: { $regex: search, $options: 'i' } },
                { candidateEmail: { $regex: search, $options: 'i' } },
                { certificateId: { $regex: search, $options: 'i' } },
                { courseName: { $regex: search, $options: 'i' } },
            ];
        }
        if (courseName) {
            filter.courseName = courseName;
        }
        const certificates = await Certificate_1.default.find(filter).sort({ createdAt: -1 });
        res.json({ success: true, data: certificates, count: certificates.length });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
exports.getAllCertificates = getAllCertificates;
// Admin: Create certificate
// POST /api/admin/certificates
const createCertificate = async (req, res) => {
    try {
        const { certificateId, candidateName, candidateEmail, courseName, issueDate, grade, templateId } = req.body;
        let finalPdfUrl = '';
        if (templateId) {
            const template = await CertificateTemplate_1.default.findById(templateId);
            if (template) {
                // Generate PDF
                const templatePath = path_1.default.join(process.cwd(), template.pdfUrl.startsWith('/') ? template.pdfUrl.slice(1) : template.pdfUrl);
                if (fs_1.default.existsSync(templatePath)) {
                    const pdfBuffer = fs_1.default.readFileSync(templatePath);
                    const pdfDoc = await pdf_lib_1.PDFDocument.load(pdfBuffer);
                    const helveticaFont = await pdfDoc.embedFont(pdf_lib_1.StandardFonts.HelveticaBold);
                    const pages = pdfDoc.getPages();
                    const firstPage = pages[0];
                    const { height } = firstPage.getSize();
                    // Overlay fields
                    for (const field of template.fields) {
                        let text = '';
                        if (field.key === 'candidateName')
                            text = candidateName;
                        else if (field.key === 'courseName')
                            text = courseName;
                        else if (field.key === 'certificateId')
                            text = certificateId;
                        else if (field.key === 'issueDate')
                            text = new Date(issueDate || Date.now()).toLocaleDateString();
                        else if (field.key === 'grade')
                            text = grade || '';
                        if (text) {
                            // pdf-lib uses Y from bottom, we likely have Y from top from the builder
                            // Coordinate translation logic: 
                            // If builder shows Y from top, pdf-lib Y = height - builderY
                            firstPage.drawText(text, {
                                x: field.x,
                                y: height - field.y,
                                size: field.fontSize || 24,
                                font: helveticaFont,
                                color: (0, pdf_lib_1.rgb)(0, 0, 0),
                            });
                        }
                    }
                    const pdfBytes = await pdfDoc.save();
                    const filename = `cert-${certificateId}-${Date.now()}.pdf`;
                    const outputDir = path_1.default.join(process.cwd(), 'uploads', 'issued');
                    if (!fs_1.default.existsSync(outputDir))
                        fs_1.default.mkdirSync(outputDir, { recursive: true });
                    const outputPath = path_1.default.join(outputDir, filename);
                    fs_1.default.writeFileSync(outputPath, pdfBytes);
                    finalPdfUrl = `/uploads/issued/${filename}`;
                }
            }
        }
        const certificate = await Certificate_1.default.create({
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
    }
    catch (error) {
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
exports.createCertificate = createCertificate;
// Admin: Bulk Issue Certificates
// POST /api/admin/certificates/bulk
const bulkCreateCertificates = async (req, res) => {
    try {
        const { certificates } = req.body; // Expecting array of { certificateId, candidateName, candidateEmail, courseName, issueDate, grade }
        if (!certificates || !Array.isArray(certificates)) {
            res.status(400).json({ success: false, message: 'Expected an array of certificates' });
            return;
        }
        const results = await Certificate_1.default.insertMany(certificates, { ordered: false });
        res.status(201).json({ success: true, count: results.length, data: results });
    }
    catch (error) {
        if (error.name === 'BulkWriteError' || error.code === 11000) {
            // Some succeeded, some failed (likely duplicate IDs)
            res.status(207).json({
                success: true,
                message: 'Partial success. Some certificates might have failed due to duplicate IDs.',
                error: error.writeErrors ? error.writeErrors.map((e) => e.errmsg) : error.message
            });
            return;
        }
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
exports.bulkCreateCertificates = bulkCreateCertificates;
// Admin: Delete certificate
// DELETE /api/admin/certificates/:id
const deleteCertificate = async (req, res) => {
    try {
        const certificate = await Certificate_1.default.findByIdAndDelete(req.params.id);
        if (!certificate) {
            res.status(404).json({ success: false, message: 'Certificate not found' });
            return;
        }
        res.json({ success: true, message: 'Certificate deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
exports.deleteCertificate = deleteCertificate;
