import mongoose, { Schema, Document } from 'mongoose';

export interface ISocialLink extends Document {
    name: string;
}

const SocialLinkSchema: Schema = new Schema({
    name: { type: String, required: true },
}, {
    timestamps: true
});

export default mongoose.models.SocialLink || mongoose.model<ISocialLink>('SocialLink', SocialLinkSchema);
