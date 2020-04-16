import bcrypt from 'bcrypt';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from './models/User';

passport.use(new LocalStrategy((username, password, done) => {
    User.findOne({ where: { username } }).then(user => {
        if (!user) return done(null, false);
        bcrypt.compare(password, user.password, (err, same) => {
            if (err) return done(err);
            if (!same) return done(null, false);
            done(null, user);
        });
    })
}));

passport.serializeUser<User, string>((user, done) => {
    console.log(user);
    done(null, user.id.toString());
});

passport.deserializeUser<User, string>((id, done) => {
    User.findByPk(id).then(user => {
        done(null, user || undefined);
    });
});
