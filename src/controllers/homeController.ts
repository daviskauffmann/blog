import Post from '../models/Post';
import expressAsync from '../utils/expressAsync';

export default {
    homePage: expressAsync(async (req, res) => {
        const posts = await Post.findAll();

        res.render('index', {
            user: req.user,
            message: req.flash('message'),
            posts,
        });
    }),
}
