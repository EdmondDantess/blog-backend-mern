import mongoose from 'mongoose';


interface IPostResult<T> extends mongoose.Document {
    _doc: T
}

interface IPost extends IPostResult<IPost> {
    user: mongoose.Types.ObjectId
    title: string
    text: string
    viewCount?: number
    imageUrl?: string
    tags?: string[]
}


const PostSchema = new mongoose.Schema<IPost>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true,
        unique: true
    },
    tags: {
        type: Array,
        default: []
    },
    viewCount: {
        type: Number,
        default: 0
    },
    imageUrl: String
}, {
    timestamps: true
});

export default mongoose.model<IPost>('Post', PostSchema);
