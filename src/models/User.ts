import { Document, model, Schema } from 'mongoose';

interface User extends Document {
    username: string;
    password: string;
}

const schema = new Schema({
    username: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
});

const User = model<User>('User', schema);

export default User;

