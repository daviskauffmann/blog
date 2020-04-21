import Post from '../models/Post';
import expressAsync from '../utils/expressAsync';

export default {
    postPage: expressAsync(async (req, res) => {
        const post = await Post.findOne({ where: { slug: req.params.slug } });
        if (!post) {
            res.sendStatus(404);
            return;
        }

        res.render('post', {
            user: req.user,
            post,
        });
    }),
    addPostPage: expressAsync(async (req, res) => {
        res.render('new-post', {
            user: req.user,
        });
    }),
    createPost: expressAsync(async (req, res) => {
        const existingPost = await Post.findOne({ where: { title: req.body.title } });
        if (existingPost) {
            res.sendStatus(409);
            return;
        }

        const post = await Post.create({
            title: req.body.title,
            content: req.body.content,
        });

        res.status(201).send(post);
    }),
    deletePost: expressAsync(async (req, res) => {
        await Post.destroy({ where: { id: req.params.id } });

        res.sendStatus(200);
    }),
};