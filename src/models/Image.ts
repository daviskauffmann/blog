import { INTEGER, Model, STRING, TEXT, TIME } from 'sequelize';
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
    createdAt: {
        type: TIME,
        field: 'created_at',
    },
    updatedAt: {
        type: TIME,
        field: 'updated_at',
    },
}, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'image',
    sequelize,
});
