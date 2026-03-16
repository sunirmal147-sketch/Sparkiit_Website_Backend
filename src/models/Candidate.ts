import mongoose, { Schema, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface ICandidate extends Document {
    name: string;
    email: string;
    password?: string;
    phone: string;
    enrolledCourses: Types.ObjectId[];
    status: 'active' | 'inactive';
    comparePassword(password: string): Promise<boolean>;
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
        password: {
            type: String,
            minlength: 4,
            select: false,
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
        performanceMetrics: {
            overallScore: { type: Number, default: 0 },
            attendance: { type: Number, default: 0 },
            progress: { type: Number, default: 0 },
        },
        completedTests: [
            {
                testId: { type: Schema.Types.ObjectId, ref: 'Test' },
                score: Number,
                date: { type: Date, default: Date.now }
            }
        ],
        submittedProjects: [
            {
                projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
                repoUrl: String,
                status: { type: String, enum: ['pending', 'reviewed', 'rejected'], default: 'pending' },
                feedback: String,
                grade: String,
                date: { type: Date, default: Date.now }
            }
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

// Hash password before saving
CandidateSchema.pre<ICandidate>('save', async function (this: ICandidate) {
    if (!this.isModified('password')) return;
    if (!this.password) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
CandidateSchema.methods.comparePassword = async function (this: ICandidate, password: string): Promise<boolean> {
    if (!this.password) return false;
    return await bcrypt.compare(password, this.password);
};

export default mongoose.models.Candidate || mongoose.model<ICandidate>('Candidate', CandidateSchema);
