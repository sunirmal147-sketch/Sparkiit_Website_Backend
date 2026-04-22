import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
    title: string;
    description: string;
    category: string;
    price: number;
    duration: string;
    status: 'active' | 'draft' | 'archived';
    batchStatus: 'ongoing' | 'upcoming' | 'past' | 'self-paced';
    imageUrl: string;
    paymentLink: string;
    links: string[];
    instructorId?: mongoose.Schema.Types.ObjectId;
    level: 'beginner' | 'intermediate' | 'advanced' | 'all';
    tags: string[];
    isApproved: 'approved' | 'pending' | 'rejected';
    isPopular: boolean;
    showHomepage: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const CourseSchema: Schema = new Schema(
    {
        title: {
            type: String,
            required: [true, 'Course title is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Course description is required'],
            trim: true,
        },
        category: {
            type: String,
            required: [true, 'Course category is required'],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, 'Course price is required'],
            min: [0, 'Price cannot be negative'],
        },
        duration: {
            type: String,
            required: [true, 'Course duration is required'],
            trim: true,
        },
        status: {
            type: String,
            enum: ['active', 'draft', 'archived'],
            default: 'draft',
        },
        batchStatus: {
            type: String,
            enum: ['ongoing', 'upcoming', 'past', 'self-paced'],
            default: 'ongoing',
        },
        imageUrl: {
            type: String,
            default: '',
        },
        paymentLink: {
            type: String,
            default: '',
        },
        links: [
            {
                type: String,
                trim: true,
            },
        ],
        instructorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        level: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced', 'all'],
            default: 'all',
        },
        tags: [
            {
                type: String,
                trim: true,
            },
        ],
        isApproved: {
            type: String,
            enum: ['approved', 'pending', 'rejected'],
            default: 'approved',
        },
        isPopular: {
            type: Boolean,
            default: false,
        },
        showHomepage: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<ICourse>('Course', CourseSchema);
