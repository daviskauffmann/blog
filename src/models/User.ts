import { Document, model, Schema } from 'mongoose';

interface User extends Document {
    username: string;
    password: string;
    roles: string[];
}

const schema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
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

