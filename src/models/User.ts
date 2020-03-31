import { Document, model, Schema } from 'mongoose';

interface User extends Document {
    username: string;
    passwordHash: string;
}

const schema = new Schema({
    username: {
        type: String,
        unique: true,
    },
    passwordHash: {
        type: String,
    },
});

const User = model<User>('User', schema);

export default User;
