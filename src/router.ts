import express from 'express';
import { body, query } from 'express-validator';
import authController from './controllers/authController';
import homeController from './controllers/homeController';
import imageController from './controllers/imageController';
import postController from './controllers/postController';
import authenticate from './middleware/authenticate';
import authorize from './middleware/authorize';
import validate from './middleware/validate';

const router = express.Router();

router.get('/',
    homeController.homePage);

router.get('/register',
    authController.registerPage);

router.post('/register',
    validate([
        body('username').isString(),
        body('password').isString(),
        body('email').isEmail().normalizeEmail(),
    ]),
    authController.register);

router.get('/login',
    authController.loginPage);

router.post('/login',
    authController.login);

router.get('/verify-email',
    authenticate,
    validate([
        query('token').isString(),
    ]),
    authController.verifyEmail);

router.get('/reset-password',
    authenticate,
    authController.resetPasswordPage);

router.post('/reset-password',
    authenticate,
    validate([
        body('currentPassword').isString(),
        body('newPassword').isString(),
    ]),
    authController.resetPassword);

router.get('/forgot-password',
    authController.forgotPasswordPage);

router.post('/send-link',
    validate([
        body('username').isString(),
    ]),
    authController.sendLink);

router.get('/reset-password-from-email',
    validate([
        query('token').isString(),
    ]),
    authController.resetPasswordFromEmailPage);

router.post('/reset-password-from-email',
    validate([
        query('token').isString(),
        body('password').isString(),
    ]),
    authController.resetPasswordFromEmail);

router.post('/logout',
    authController.logout);

router.get('/posts/:slug',
    postController.postPage);

router.get('/images/:filename',
    imageController.getImage);

router.get('/admin/add-post',
    authenticate,
    authorize(['admin']),
    postController.renderAddPost);

router.post('/admin/posts',
    authenticate,
    authorize(['admin']),
    validate([
        body('title').isString(),
        body('content').isString(),
    ]),
    postController.createPost);

router.delete('/admin/posts/:id',
    authenticate,
    authorize(['admin']),
    postController.deletePost);

router.get('/admin/images',
    authenticate,
    authorize(['admin']),
    imageController.imagesPage);

router.delete('/admin/images/:id',
    authenticate,
    authorize(['admin']),
    imageController.deleteImage);

router.get('/admin/add-image',
    authenticate,
    imageController.addImagePage);

router.post('/admin/images',
    authenticate,
    authorize(['admin']),
    validate([
        body('filename').isString(),
        body('data').isString(),
    ]),
    imageController.createImage);

export default router;
