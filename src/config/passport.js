const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const { AppDataSource } = require("./database");
const UserEntity = require("../entities/User");

const userRepository = AppDataSource.getRepository(UserEntity);

passport.use(
  new GoogleStrategy(
    {
          clientID: process.env.GOOGLE_CLIENT_ID || "test",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "test",
      callbackURL:
        process.env.NODE_ENV === "production"
          ? `${process.env.Base_URL}/auth/google/callback`
          : "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const googleId = profile.id;

        let user = await userRepository.findOne({
          where: { email },
        });

        // 🆕 CASE 1: User does not exist → create OAuth user
        if (!user) {
          user = userRepository.create({
            name: profile.displayName,
            email,
            password: null,
            provider: "oauth",
            googleId,
          });

          await userRepository.save(user);
          return done(null, user);
        }

        // 🔗 CASE 2: User exists → link Google safely
        if (!user.googleId) {
          user.googleId = googleId;
          await userRepository.save(user);
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL:
        process.env.NODE_ENV === "production"
          ? `${process.env.BASE_URL}/auth/github/callback`
          : "http://localhost:3000/auth/github/callback",
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
     
        let email = null;

        if (profile.emails && profile.emails.length > 0) {
          email = profile.emails[0].value;
        }
        if (!email) {
          return done(
            new Error("GitHub account does not have a public email"),
            null
          );
        }

        let user = await userRepository.findOne({
          where: { email },
        });

        if (!user) {
          user = userRepository.create({
            name: profile.username,
            email,
            password: null,
            provider: "oauth",
            githubId: profile.id,
          });

          await userRepository.save(user);
          return done(null, user);
        }

        if (!user.githubId) {
          user.githubId = profile.id;
          await userRepository.save(user);
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
module.exports = passport;
