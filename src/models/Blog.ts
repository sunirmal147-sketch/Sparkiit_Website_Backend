import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
    title: string;
    slug: string;
    content: string;
    authorId?: mongoose.Schema.Types.ObjectId;
    category: string;
    imageUrl: string;
    tags: string[];
    status: 'publish' | 'draft';
    metaTitle?: string;
    metaDescription?: string;
    createdAt: Date;
    updatedAt: Date;
}

const BlogSchema: Schema = new Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    category: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    tags: [{ type: String }],
    status: { type: String, enum: ['publish', 'draft'], default: 'draft' },
    metaTitle: { type: String },
    metaDescription: { type: String },
}, {
    timestamps: true
});


export default mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);
