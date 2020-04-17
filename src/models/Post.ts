import { INTEGER, Model, STRING, TEXT } from 'sequelize';
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
}, {
    sequelize,
});

Post.beforeValidate(post => {
    post.slug = slugify(post.title, {
        lower: true,
        strict: true,
    });
});
