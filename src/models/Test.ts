import mongoose, { Schema, Document } from 'mongoose';

export interface ITest extends Document {
    title: string;
    courseId: mongoose.Types.ObjectId;
    questions: {
        question: string;
        options: string[];
        correctAnswer: number;
    }[];
    duration: number; // in minutes
    category: string;
    createdAt: Date;
    updatedAt: Date;
}

const TestSchema: Schema = new Schema(
    {
        title: {
            type: String,
            required: [true, 'Test title is required'],
            trim: true,
        },
        courseId: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
        },
        questions: [
            {
                question: String,
                options: [String],
                correctAnswer: Number,
            },
        ],
        duration: {
            type: Number,
            default: 30,
        },
        category: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<ITest>('Test', TestSchema);
