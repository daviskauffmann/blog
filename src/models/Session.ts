import { DATE, Model, STRING, TEXT } from 'sequelize';
import sequelize from '../sequelize';

export default class Session extends Model {
    session_id!: string;
    expires!: Date;
    data!: string;
    createdAt!: Date;
    updatedAt!: Date;
}

Session.init({
    session_id: {
        type: STRING,
        primaryKey: true,
    },
    expires: {
        type: DATE,
        allowNull: false,
    },
    data: {
        type: TEXT,
        allowNull: false,
    },
}, { sequelize });
