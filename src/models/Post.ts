import { Document, model, Schema, Types } from 'mongoose';

interface Post extends Document {
    userId: Types.ObjectId;
    title: String;
    slug: string;
    content: string;
}

const schema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
});

const Post = model<Post>('Post', schema);

export default Post;

