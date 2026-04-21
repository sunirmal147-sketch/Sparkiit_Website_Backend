import mongoose, { Schema, Document } from 'mongoose';

export interface IRecognition extends Document {
    name: string;
    logoUrl: string;
    link?: string;
    order: number;
}

const RecognitionSchema: Schema = new Schema({
    name: { type: String, required: true },
    logoUrl: { type: String, required: true },
    link: { type: String, default: "" },
    order: { type: Number, default: 0 }
}, {
    timestamps: true
});

export default mongoose.models.Recognition || mongoose.model<IRecognition>('Recognition', RecognitionSchema);
