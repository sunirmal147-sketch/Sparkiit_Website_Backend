import mongoose, { Schema, Document } from 'mongoose';

export interface ICertificate extends Document {
    certificateId: string;
    candidateName: string;
    candidateEmail: string;
    courseName: string;
    issueDate: Date;
    grade?: string;
    templateId?: mongoose.Types.ObjectId;
    finalPdfUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

const CertificateSchema: Schema = new Schema(
    {
        certificateId: {
            type: String,
            required: [true, 'Certificate ID is required'],
            unique: true,
            trim: true,
        },
        candidateName: {
            type: String,
            required: [true, 'Candidate name is required'],
            trim: true,
        },
        candidateEmail: {
            type: String,
            required: [true, 'Candidate email is required'],
            trim: true,
            lowercase: true,
        },
        courseName: {
            type: String,
            required: [true, 'Course name is required'],
            trim: true,
        },
        issueDate: {
            type: Date,
            required: [true, 'Issue date is required'],
            default: Date.now,
        },
        grade: {
            type: String,
            trim: true,
        },
        templateId: {
            type: Schema.Types.ObjectId,
            ref: 'CertificateTemplate',
        },
        finalPdfUrl: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<ICertificate>('Certificate', CertificateSchema);
