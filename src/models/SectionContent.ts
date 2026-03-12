import mongoose, { Schema, Document } from 'mongoose';

export interface ISectionContent extends Document {
    section: string; // e.g., 'hero', 'story', 'working-process'
    key: string;     // e.g., 'title', 'subtitle', 'description'
    value: string;
}

const SectionContentSchema: Schema = new Schema({
    section: { type: String, required: true },
    key: { type: String, required: true },
    value: { type: String, required: true }
}, {
    timestamps: true
});

// Ensure unique combination of section and key
SectionContentSchema.index({ section: 1, key: 1 }, { unique: true });

export default mongoose.models.SectionContent || mongoose.model<ISectionContent>('SectionContent', SectionContentSchema);
