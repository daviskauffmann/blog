import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from './models/User';

passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await User.findOne({ where: { username } });
        if (!user) return done(null, false);

        const same = await user.comparePassword(password);
        if (!same) return done(null, false);

        done(null, user);
    } catch (err) {
        done(err);
    }
}));

passport.serializeUser<string>((user: any, done) => {
    done(null, user.id.toString());
});

passport.deserializeUser<string>(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

export default passport;
