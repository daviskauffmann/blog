import { Document, model, Schema } from 'mongoose';

interface Image extends Document {
    filename: string;
    data: string;
}

const schema = new Schema({
    filename: {
        type: String,
        unique: true,
    },
    data: {
        type: String,
    },
});

const Image = model<Image>('Image', schema);

export default Image;

