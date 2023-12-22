import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
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

export default mongoose.model('Post', PostSchema);
