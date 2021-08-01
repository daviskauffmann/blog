import app from './app';
import sequelize from './sequelize';
import bcrypt from 'bcrypt';

sequelize.authenticate()
    .then(() => console.log(`Connected to database: ${process.env.DATABASE_URI}`))
    .then(() => sequelize.sync())
    .then(async () => sequelize.query(`
        INSERT INTO "user" ("id", "username", "password", "email", "verified", "roles")
        SELECT
            1 AS "id",
            'admin' AS "username",
            '${await bcrypt.hash('admin', 12)}' AS "password",
            'admin@admin.com' AS "email",
            true as "verified",
            ARRAY['admin'] AS "roles"
        WHERE NOT EXISTS (
            SELECT "id"
            FROM "user"
            WHERE "id" = 1
        )
    `))
    .then(() => {
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    });
