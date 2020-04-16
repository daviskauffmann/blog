import Post from '../models/Post';
import expressAsync from '../utils/expressAsync';

export default {
    postsPage: expressAsync(async (req, res) => {
        const posts = await Post.findAll();

        res.render('index', {
            user: req.user,
            posts,
        });
    }),
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
    renderAddPost: expressAsync(async (req, res) => {
        res.render('add-post', {
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

        res.redirect(`/posts/${post.slug}`);
    }),
    deletePost: expressAsync(async (req, res) => {
        await Post.destroy({ where: { id: req.params.id } });

        res.redirect('/');
    }),
};
