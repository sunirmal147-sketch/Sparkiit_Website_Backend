import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
    title: string;
    content: string;
    author: string;
    category: string;
    imageUrl: string;
    createdAt: Date;
    updatedAt: Date;
}

const BlogSchema: Schema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    imageUrl: { type: String, default: '' },
}, {
    timestamps: true
});

export default mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);
