import mongoose, { Schema, Document } from 'mongoose';

export interface IBrand extends Document {
    name: string;
    logoUrl?: string;
    link?: string;
    order?: number;
}

const BrandSchema: Schema = new Schema({
    name: { type: String, required: true },
    logoUrl: { type: String, default: "" },
    link: { type: String, default: "" },
    order: { type: Number, default: 0 }
}, {
    timestamps: true
});

export default mongoose.models.Brand || mongoose.model<IBrand>('Brand', BrandSchema);
