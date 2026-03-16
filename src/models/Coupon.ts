import mongoose, { Schema, Document } from 'mongoose';

export interface ICoupon extends Document {
    name: string;
}

const CouponSchema: Schema = new Schema({
    name: { type: String, required: true },
}, {
    timestamps: true
});

export default mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema);
