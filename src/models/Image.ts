import { INTEGER, Model, STRING, TEXT } from 'sequelize';
import sequelize from '../sequelize';

export default class Image extends Model {
    id!: number;
    filename!: string;
    data!: string;
    createdAt!: Date;
    updatedAt!: Date;
}

Image.init({
    id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    filename: {
        type: STRING,
        unique: true,
        allowNull: false,
    },
    data: {
        type: TEXT,
        allowNull: false,
    },
}, { sequelize });
