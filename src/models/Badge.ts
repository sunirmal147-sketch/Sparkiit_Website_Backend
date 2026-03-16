import mongoose, { Schema, Document } from 'mongoose';

export interface IBadge extends Document {
    name: string;
}

const BadgeSchema: Schema = new Schema({
    name: { type: String, required: true },
}, {
    timestamps: true
});

export default mongoose.models.Badge || mongoose.model<IBadge>('Badge', BadgeSchema);
