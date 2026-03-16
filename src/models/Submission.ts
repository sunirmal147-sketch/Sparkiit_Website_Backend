import mongoose, { Schema, Document } from 'mongoose';

export interface ISubmission extends Document {
    candidateId: mongoose.Types.ObjectId;
    projectId: mongoose.Types.ObjectId;
    repoUrl: string;
    status: 'pending' | 'reviewed' | 'rejected';
    feedback?: string;
    grade?: string;
    createdAt: Date;
    updatedAt: Date;
}

const SubmissionSchema: Schema = new Schema(
    {
        candidateId: {
            type: Schema.Types.ObjectId,
            ref: 'Candidate',
            required: true,
        },
        projectId: {
            type: Schema.Types.ObjectId,
            ref: 'Project',
            required: true,
        },
        repoUrl: {
            type: String,
            required: [true, 'Repository URL is required'],
            trim: true,
        },
        status: {
            type: String,
            enum: ['pending', 'reviewed', 'rejected'],
            default: 'pending',
        },
        feedback: String,
        grade: String,
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<ISubmission>('Submission', SubmissionSchema);
