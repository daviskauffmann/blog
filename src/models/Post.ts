import { INTEGER, Model, STRING, TEXT, TIME } from 'sequelize';
import slugify from 'slugify';
import sequelize from '../sequelize';

export default class Post extends Model {
    id!: number;
    title!: string;
    slug!: string;
    content!: string;
    createdAt!: Date;
    updatedAt!: Date;
}

Post.init({
    id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: STRING,
        unique: true,
        allowNull: false,
    },
    slug: {
        type: STRING,
        unique: true,
        allowNull: false,
    },
    content: {
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
    tableName: 'post',
    sequelize,
});

Post.beforeValidate(post => {
    post.slug = slugify(post.title, {
        lower: true,
        strict: true,
    });
});
