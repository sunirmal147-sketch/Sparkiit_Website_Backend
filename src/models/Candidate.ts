import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICandidate extends Document {
    name: string;
    email: string;
    phone: string;
    enrolledCourses: Types.ObjectId[];
    status: 'active' | 'inactive';
    createdAt: Date;
    updatedAt: Date;
}

const CandidateSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Candidate name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true,
        },
        phone: {
            type: String,
            default: '',
            trim: true,
        },
        enrolledCourses: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Course',
            },
        ],
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active',
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<ICandidate>('Candidate', CandidateSchema);
