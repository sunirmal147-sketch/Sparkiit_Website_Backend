import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
    title: string;
    description: string;
    date: Date;
    location: string;
    image: string;
    type: 'ongoing' | 'upcoming' | 'past';
    link?: string;
}

const EventSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    image: { type: String, required: true },
    type: { 
        type: String, 
        enum: ['ongoing', 'upcoming', 'past'], 
        required: true,
        default: 'upcoming'
    },
    link: { type: String }
}, {
    timestamps: true
});

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
