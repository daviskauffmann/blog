import { Document, model, Schema, Types } from 'mongoose';

interface Image extends Document {
    userId: Types.ObjectId;
    filename: string;
    data: string;
}

const schema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    filename: {
        type: String,
        required: true,
    },
    data: {
        type: String,
        required: true,
    },
});

const Image = model<Image>('Image', schema);

export default Image;

