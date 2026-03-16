import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBooking extends Document {
    candidate: Types.ObjectId;
    course: Types.ObjectId;
    slotDate: Date;
    slotTime: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const BookingSchema: Schema = new Schema(
    {
        candidate: {
            type: Schema.Types.ObjectId,
            ref: 'Candidate',
            required: [true, 'Candidate is required'],
        },
        course: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
            required: [true, 'Course is required'],
        },
        slotDate: {
            type: Date,
            required: [true, 'Slot date is required'],
        },
        slotTime: {
            type: String,
            required: [true, 'Slot time is required'],
            trim: true,
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'completed', 'cancelled'],
            default: 'pending',
        },
        notes: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
