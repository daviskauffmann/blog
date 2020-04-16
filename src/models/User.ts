import bcrypt from 'bcrypt';
import { Model, STRING, ARRAY, INTEGER } from 'sequelize';
import sequelize from '../sequelize';

export default class User extends Model {
    id!: number;
    username!: string;
    password!: string;
    email!: string;
    roles!: string[];
    createdAt!: Date;
    updatedAt!: Date;
}

User.init({
    id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: STRING,
        allowNull: false,
    },
    email: {
        type: STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        }
    },
    roles: {
        type: ARRAY(STRING),
        allowNull: false,
    },
}, { sequelize });

User.beforeValidate(async user => {
    user.password = await bcrypt.hash(user.password, 12);
});
