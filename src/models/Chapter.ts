import mongoose, { Schema, Document } from 'mongoose';

export interface IChapter extends Document {
    courseId: mongoose.Schema.Types.ObjectId;
    title: string;
    order: number;
    status: 'active' | 'inactive';
    createdAt: Date;
    updatedAt: Date;
}

const ChapterSchema: Schema = new Schema(
    {
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
        },
        title: {
            type: String,
            required: [true, 'Chapter title is required'],
            trim: true,
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
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Chapter || mongoose.model<IChapter>('Chapter', ChapterSchema);
