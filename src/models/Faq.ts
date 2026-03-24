import mongoose, { Schema, Document } from 'mongoose';

export interface IFaq extends Document {
    question: string;
    answer: string;
    order?: number;
}

const FaqSchema: Schema = new Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    order: { type: Number, default: 0 },
}, {
    timestamps: true
});

export default mongoose.models.Faq || mongoose.model<IFaq>('Faq', FaqSchema);
