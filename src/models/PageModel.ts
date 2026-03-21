import mongoose, { Schema, Document } from 'mongoose';

export interface IPageModel extends Document {
    name: string;
    sections: {
        name: string;
        enabled: boolean;
        order: number;
    }[];
}

const PageModelSchema: Schema = new Schema({
    name: { type: String, required: true },
    sections: [{
        name: { type: String, required: true },
        enabled: { type: Boolean, default: true },
        order: { type: Number, required: true }
    }]
}, {
    timestamps: true
});

export default mongoose.models.PageModel || mongoose.model<IPageModel>('PageModel', PageModelSchema);
