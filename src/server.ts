import app from './app';
import sequelize from './sequelize';

sequelize.authenticate()
    .then(() => sequelize.sync())
    .then(() => {
        console.log(`Connected to ${process.env.DATABASE_URI}`);

        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    });
