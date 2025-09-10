import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/User";


// console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID);
// console.log("JWT secret:", process.env.JWT_SECRET);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:4000/auth/google/callback",
    },
    async (_accessToken, _refreshToken, profile, done) => {
      const existing = await User.findOne({ googleId: profile.id });
      if (existing) return done(null, existing);

      const user = await User.create({
        googleId: profile.id,
        email: profile.emails?.[0].value,
        name: profile.displayName,
        avatar: profile.photos?.[0].value,
      });
      return done(null, user);
    }
  )
);

passport.serializeUser((user: any, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

export default passport;
