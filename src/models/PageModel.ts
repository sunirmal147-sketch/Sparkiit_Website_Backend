import mongoose, { Schema, Document } from 'mongoose';

export interface IPageModel extends Document {
    name: string;
    sections: {
        name: string;
        enabled: boolean;
        order: number;
        content: any; // Flexible JSON content for section-specific data
    }[];
}

const PageModelSchema: Schema = new Schema({
    name: { type: String, required: true },
    sections: [{
        name: { type: String, required: true },
        enabled: { type: Boolean, default: true },
        order: { type: Number, required: true },
        content: { type: Schema.Types.Mixed, default: {} }
    }]
}, {
    timestamps: true
});


export default mongoose.models.PageModel || mongoose.model<IPageModel>('PageModel', PageModelSchema);
