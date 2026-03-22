import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
    user: mongoose.Types.ObjectId;
    photoUrl?: string;
    timestamp: Date;
    type: 'LOGIN' | 'LOGOUT';
    ip?: string;
}

const AttendanceSchema: Schema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        photoUrl: {
            type: String,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
        type: {
            type: String,
            enum: ['LOGIN', 'LOGOUT'],
            default: 'LOGIN',
        },
        ip: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IAttendance>('Attendance', AttendanceSchema);
