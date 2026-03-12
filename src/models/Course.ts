import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
    title: string;
    description: string;
    category: string;
    price: number;
    duration: string;
    status: 'active' | 'draft' | 'archived';
    imageUrl: string;
    links: string[];
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
        imageUrl: {
            type: String,
            default: '',
        },
        links: [
            {
                type: String,
                trim: true,
            },
        ],
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<ICourse>('Course', CourseSchema);
