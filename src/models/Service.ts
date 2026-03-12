import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
    title: string;
    order: number;
}

const ServiceSchema: Schema = new Schema({
    title: { type: String, required: true },
    order: { type: Number, default: 0 }
}, {
    timestamps: true
});

export default mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);
