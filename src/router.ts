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

router.post('/resend-email-verification',
    authenticate,
    authController.resendEmailVerification);

router.get('/verify-email',
    authenticate,
    validate([
        query('token').isJWT(),
    ]),
    authController.verifyEmail);

router.get('/change-password',
    authenticate,
    authController.changePasswordPage);

router.post('/change-password',
    authenticate,
    validate([
        body('currentPassword').isString(),
        body('newPassword').isString(),
    ]),
    authController.changePassword);

router.get('/forgot-password',
    authController.forgotPasswordPage);

router.post('/send-password-reset-link',
    validate([
        body('email').isString(),
    ]),
    authController.sendPasswordResetLink);

router.get('/reset-password',
    validate([
        query('token').isJWT(),
    ]),
    authController.resetPasswordPage);

router.post('/reset-password',
    validate([
        query('token').isJWT(),
        body('newPassword').isString(),
    ]),
    authController.resetPassword);

router.post('/logout',
    authController.logout);

router.get('/posts/:slug',
    postController.postPage);

router.get('/images/:filename',
    imageController.getImage);

router.get('/admin/new-post',
    authenticate,
    authorize(['admin']),
    postController.addPostPage);

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

router.get('/admin/new-image',
    authenticate,
    authorize(['admin']),
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
