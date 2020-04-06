import mongoose from 'mongoose';
import app from './app';

mongoose.connect(process.env.MONGODB_URI!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}, err => {
    if (err) throw err;
    console.log(`Connected to ${process.env.MONGODB_URI}`);

    // TODO: seed with admin user

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
});
