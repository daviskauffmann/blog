import { Document, model, Schema } from 'mongoose';

interface Post extends Document {
    title: String;
    slug: string;
    content: string;
}

const schema = new Schema({
    title: {
        type: String,
    },
    slug: {
        type: String,
        unique: true,
    },
    content: {
        type: String,
    },
});

const Post = model<Post>('Post', schema);

export default Post;

