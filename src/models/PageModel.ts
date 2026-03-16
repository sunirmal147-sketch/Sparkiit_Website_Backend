import mongoose, { Schema, Document } from 'mongoose';

export interface IPageModel extends Document {
    name: string;
}

const PageModelSchema: Schema = new Schema({
    name: { type: String, required: true },
}, {
    timestamps: true
});

export default mongoose.models.PageModel || mongoose.model<IPageModel>('PageModel', PageModelSchema);
