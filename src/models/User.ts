import mongoose from 'mongoose';

interface IUserResult<T> extends mongoose.Document {
    _doc: T
}

export interface IUser extends IUserResult<IUser> {
    fullName: string
    email: string
    passwordHash: string
    avatarUrl: string
}

const UserSchema = new mongoose.Schema<IUser>({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    avatarUrl: String

}, {
    timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);
