import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    role: 'SUPER_ADMIN' | 'ADMIN' | 'HR' | 'TEAM_LEADER' | 'MANAGER' | 'BDE' | 'BDA' | 'USER';
    allowedSections: string[];
    comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: 4,
        },
        role: {
            type: String,
            enum: ['SUPER_ADMIN', 'ADMIN', 'HR', 'TEAM_LEADER', 'MANAGER', 'BDE', 'BDA', 'USER'],
            default: 'ADMIN',
        },
        allowedSections: {
            type: [String],
            default: []
        }
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
UserSchema.pre<IUser>('save', async function (this: IUser) {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.comparePassword = async function (this: IUser, password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
