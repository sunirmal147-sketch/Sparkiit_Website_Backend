import mongoose, { Document, Schema } from 'mongoose';

export interface IMentor extends Document {
    name: string;
    description: string;
    photo: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

const MentorSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    photo: { type: String, required: true },
    order: { type: Number, default: 0 },
}, {
    timestamps: true
});

export default mongoose.model<IMentor>('Mentor', MentorSchema);
