import mongoose, { Schema, Document } from 'mongoose';

export interface IMenu extends Document {
    name: string;
}

const MenuSchema: Schema = new Schema({
    name: { type: String, required: true },
}, {
    timestamps: true
});

export default mongoose.models.Menu || mongoose.model<IMenu>('Menu', MenuSchema);
