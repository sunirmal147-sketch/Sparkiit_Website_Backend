import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
    title: string;
    description: string;
    link: string;
    order: number;
}

const ServiceSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, default: "" },
    link: { type: String, default: "" },
    order: { type: Number, default: 0 }
}, {
    timestamps: true
});

export default mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);
