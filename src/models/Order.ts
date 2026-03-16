import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IOrder extends Document {
    candidate: Types.ObjectId;
    course: Types.ObjectId;
    amount: number;
    currency: string;
    razorpay_order_id: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
    status: 'pending' | 'success' | 'failed';
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
    {
        candidate: {
            type: Schema.Types.ObjectId,
            ref: 'Candidate',
            required: true,
        },
        course: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            default: 'INR',
        },
        razorpay_order_id: {
            type: String,
            required: true,
            unique: true,
        },
        razorpay_payment_id: {
            type: String,
        },
        razorpay_signature: {
            type: String,
        },
        status: {
            type: String,
            enum: ['pending', 'success', 'failed'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
