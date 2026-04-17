import mongoose, { Schema, Document } from 'mongoose';

export interface ICertificateField {
    key: string;
    label: string;
    x: number;
    y: number;
    fontSize: number;
    color: string;
    bold: boolean;
}

export interface ICertificateTemplate extends Document {
    name: string;
    type: 'INTERNSHIP' | 'PROJECT';
    pdfUrl: string;
    width: number;
    height: number;
    fields: ICertificateField[];
    createdAt: Date;
    updatedAt: Date;
}

const CertificateFieldSchema: Schema = new Schema({
    key: { type: String, required: true },
    label: { type: String, required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    fontSize: { type: Number, default: 24 },
    color: { type: String, default: '#000000' },
    bold: { type: Boolean, default: false },
});

const CertificateTemplateSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Template name is required'],
            trim: true,
        },
        type: {
            type: String,
            enum: ['INTERNSHIP', 'PROJECT'],
            default: 'INTERNSHIP',
        },
        pdfUrl: {
            type: String,
            required: [true, 'PDF file URL is required'],
        },
        width: { type: Number, required: true },
        height: { type: Number, required: true },
        fields: [CertificateFieldSchema],
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.CertificateTemplate || mongoose.model<ICertificateTemplate>('CertificateTemplate', CertificateTemplateSchema);
