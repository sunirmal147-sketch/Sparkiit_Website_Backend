import mongoose, { Schema, Document } from 'mongoose';

export interface IFooterSetting extends Document {
    name: string;
}

const FooterSettingSchema: Schema = new Schema({
    name: { type: String, required: true },
}, {
    timestamps: true
});

export default mongoose.models.FooterSetting || mongoose.model<IFooterSetting>('FooterSetting', FooterSettingSchema);
