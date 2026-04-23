import mongoose, { Schema, Document } from 'mongoose';

export interface IPageModel extends Document {
    name: string;
    slug: string;
    status: 'active' | 'inactive';
    isSimple: boolean;
    sections: {
        name: string;
        enabled: boolean;
        order: number;
        content: any;
    }[];
}

const PageModelSchema: Schema = new Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    isSimple: { type: Boolean, default: false },
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
