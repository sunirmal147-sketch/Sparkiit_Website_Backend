import mongoose, { Schema, Document } from 'mongoose';

export interface ISetting extends Document {
    name: string;
}

const SettingSchema: Schema = new Schema({
    name: { type: String, required: true },
}, {
    timestamps: true
});

export default mongoose.models.Setting || mongoose.model<ISetting>('Setting', SettingSchema);
