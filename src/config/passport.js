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
          ? `${process.env.CLIENT_URL}/auth/google/callback`
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
      callbackURL: "/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const githubId = profile.id;

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
            githubId,
          });

          await userRepository.save(user);
          return done(null, user);
        }

        // 🔗 CASE 2: User exists → link Google safely
        if (!user.githubId) {
          user.githubId = githubId;
          await userRepository.save(user);
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);

module.exports = passport;
