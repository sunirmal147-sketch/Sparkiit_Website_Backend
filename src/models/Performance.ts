import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPerformance extends Document {
    userId: Types.ObjectId;
    leadId: Types.ObjectId;
    title: string;
    startDate: Date;
    endDate: Date;
    targetRevenue: number;
    targetCount: number;
    manualAdjustmentAmount: number;
    manualAdjustmentCount: number;
}

const PerformanceSchema: Schema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        leadId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        targetRevenue: {
            type: Number,
            default: 0,
        },
        targetCount: {
            type: Number,
            default: 0,
        },
        manualAdjustmentAmount: {
            type: Number,
            default: 0,
        },
        manualAdjustmentCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Performance || mongoose.model<IPerformance>('Performance', PerformanceSchema);
