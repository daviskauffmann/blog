import bcrypt from 'bcrypt';
import { Model, STRING, ARRAY, INTEGER, BOOLEAN } from 'sequelize';
import sequelize from '../sequelize';

export default class User extends Model {
    id!: number;
    username!: string;
    password!: string;
    email!: string;
    verified!: boolean;
    roles!: string[];
    createdAt!: Date;
    updatedAt!: Date;

    async comparePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
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
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true,
        }
    },
    verified: {
        type: BOOLEAN,
        allowNull: false,
    },
    roles: {
        type: ARRAY(STRING),
        allowNull: false,
    },
}, {
    sequelize,
});

User.beforeValidate(async user => {
    if (user.password) {
        user.password = await bcrypt.hash(user.password, 12);
    }
});
