import mongoose, { Schema, Document } from 'mongoose';

export interface ILocation extends Document {
    name: string;
}

const LocationSchema: Schema = new Schema({
    name: { type: String, required: true },
}, {
    timestamps: true
});

export default mongoose.models.Location || mongoose.model<ILocation>('Location', LocationSchema);
