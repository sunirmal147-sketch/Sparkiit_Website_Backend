import mongoose, { Schema, Document } from 'mongoose';

export interface ISetting extends Document {
    key: string;
    value: string;
    group: string;
}

const SettingSchema: Schema = new Schema({
    key: { type: String, required: true, unique: true },
    value: { type: String, default: "" },
    group: { type: String, default: "general" }, // e.g., 'general', 'social', 'seo'
}, {
    timestamps: true
});

export default mongoose.models.Setting || mongoose.model<ISetting>('Setting', SettingSchema);
