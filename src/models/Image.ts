import { Document, model, Schema, Types } from 'mongoose';

interface Image extends Document {
    filename: string;
    data: string;
}

const schema = new Schema({
    filename: {
        type: String,
        required: true,
        unique: true,
    },
    data: {
        type: String,
        required: true,
    },
});

const Image = model<Image>('Image', schema);

export default Image;

