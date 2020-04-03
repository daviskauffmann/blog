import fs from 'fs';
import https from 'https';
import mongoose from 'mongoose';
import app from './app';

const server = https.createServer({
    key: fs.readFileSync('ssl.key'),
    cert: fs.readFileSync('ssl.cert'),
}, app);

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
