import http from 'http';
import mongoose from 'mongoose';
import app from './app';

const server = http.createServer(app);

mongoose.connect(process.env.MONGODB_URI!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}, err => {
    if (err) throw err;
    // TODO: seed with admin user
    console.log(`Connected to ${process.env.MONGODB_URI}`);
    server.listen(process.env.PORT, () => {
        console.log(`Server listening on port ${process.env.PORT}`);
    });
});
