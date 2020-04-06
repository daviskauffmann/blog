import { Document, model, Schema } from 'mongoose';

interface User extends Document {
    username: string;
    email: string;
    password: string;
    roles: string[];
}

const schema = new Schema<User>({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    roles: {
        type: [String],
        required: true,
    }
});

const User = model<User>('User', schema);

export default User;

