import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
    num: string;
    title: string;
    category: string;
    image: string;
    order: number;
}

const ProjectSchema: Schema = new Schema({
    num: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    order: { type: Number, default: 0 }
}, {
    timestamps: true
});

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
