import http from 'http';
import mongoose from 'mongoose';
import app from './app';

const server = http.createServer({
    // key: fs.readFileSync('server.key'),
    // cert: fs.readFileSync('server.cert')
}, app);

mongoose.connect(process.env.MONGODB_URI!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}, err => {
    if (err) throw err;
    console.log(`Connected to ${process.env.MONGODB_URI}`);
    server.listen(process.env.PORT, () => {
        console.log(`Server listening on port ${process.env.PORT}`);
    });
});
