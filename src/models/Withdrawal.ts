import mongoose, { Schema, Document } from 'mongoose';

export interface IWithdrawal extends Document {
    name: string;
}

const WithdrawalSchema: Schema = new Schema({
    name: { type: String, required: true },
}, {
    timestamps: true
});

export default mongoose.models.Withdrawal || mongoose.model<IWithdrawal>('Withdrawal', WithdrawalSchema);
