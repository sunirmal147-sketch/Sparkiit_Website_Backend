"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTemplate = exports.getAllTemplates = exports.createTemplate = exports.uploadTemplatePDF = void 0;
const pdf_lib_1 = require("pdf-lib");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const CertificateTemplate_1 = __importDefault(require("../models/CertificateTemplate"));
/**
 * POST /api/admin/templates/upload
 * Handles PDF upload and returns dimensions
 */
const uploadTemplatePDF = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ success: false, message: 'No file uploaded' });
            return;
        }
        const filePath = req.file.path;
        const pdfBuffer = fs_1.default.readFileSync(filePath);
        const pdfDoc = await pdf_lib_1.PDFDocument.load(pdfBuffer);
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.uploadTemplatePDF = uploadTemplatePDF;
/**
 * POST /api/admin/templates
 * Saves the template configuration
 */
const createTemplate = async (req, res) => {
    try {
        const { name, type, pdfUrl, width, height, fields } = req.body;
        const template = await CertificateTemplate_1.default.create({
            name,
            type,
            pdfUrl,
            width,
            height,
            fields
        });
        res.status(201).json({ success: true, data: template });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createTemplate = createTemplate;
/**
 * GET /api/admin/templates
 */
const getAllTemplates = async (req, res) => {
    try {
        const templates = await CertificateTemplate_1.default.find().sort({ createdAt: -1 });
        res.json({ success: true, data: templates });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAllTemplates = getAllTemplates;
/**
 * DELETE /api/admin/templates/:id
 */
const deleteTemplate = async (req, res) => {
    try {
        const template = await CertificateTemplate_1.default.findById(req.params.id);
        if (!template) {
            res.status(404).json({ success: false, message: 'Template not found' });
            return;
        }
        // Optional: delete actual file
        const filePath = path_1.default.join(process.cwd(), template.pdfUrl);
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
        }
        await template.deleteOne();
        res.json({ success: true, message: 'Template deleted' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteTemplate = deleteTemplate;
