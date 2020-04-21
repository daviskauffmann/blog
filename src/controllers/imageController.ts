import Image from '../models/Image';
import expressAsync from '../utils/expressAsync';

export default {
    getImage: expressAsync(async (req, res) => {
        const image = await Image.findOne({ where: { filename: req.params.filename } });
        if (!image) {
            res.sendStatus(404);
            return;
        }

        const data = Buffer.from(image.data.replace(/^data:image\/png;base64,/, ''), 'base64');
        res.contentType('png');
        res.header('Content-Length', data.length.toString());
        res.status(200).send(data);
    }),
    imagesPage: expressAsync(async (req, res) => {
        const images = await Image.findAll();

        res.render('images', {
            user: req.user,
            images,
        });
    }),
    deleteImage: expressAsync(async (req, res) => {
        await Image.destroy({ where: { id: req.params.id } });

        res.sendStatus(200);
    }),
    addImagePage: expressAsync(async (req, res) => {
        res.render('new-image', {
            user: req.user,
        });
    }),
    createImage: expressAsync(async (req, res) => {
        const existingImage = await Image.findOne({ where: { filename: req.body.filename } });
        if (existingImage) {
            res.sendStatus(409);
            return;
        }

        const image = await Image.create({
            filename: req.body.filename,
            data: req.body.data,
        });

        res.status(201).send(image);
    }),
};
