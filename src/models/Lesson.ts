import mongoose, { Schema, Document } from 'mongoose';

export interface ILesson extends Document {
    courseId: mongoose.Schema.Types.ObjectId;
    chapterId: mongoose.Schema.Types.ObjectId;
    title: string;
    description: string;
    lessonType: 'video' | 'text' | 'document' | 'quiz';
    videoUrl?: string;
    videoDuration?: string;
    documentUrl?: string;
    textContent?: string;
    order: number;
    status: 'active' | 'inactive';
    isFree: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const LessonSchema: Schema = new Schema(
    {
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
        },
        chapterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Chapter',
            required: true,
        },
        title: {
            type: String,
            required: [true, 'Lesson title is required'],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        lessonType: {
            type: String,
            enum: ['video', 'text', 'document', 'quiz'],
            default: 'video',
        },
        videoUrl: {
            type: String,
            trim: true,
        },
        videoDuration: {
            type: String,
            trim: true,
        },
        documentUrl: {
            type: String,
            trim: true,
        },
        textContent: {
            type: String,
        },
        order: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active',
        },
        isFree: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Lesson || mongoose.model<ILesson>('Lesson', LessonSchema);
