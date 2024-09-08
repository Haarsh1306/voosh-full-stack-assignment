const passport = require("passport");
const pool = require("./db/db");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, cb) {
      const email = profile.emails[0].value;
      const first_name = profile.name.givenName;
      const last_name = profile.name.familyName;
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
      console.log("alredy exist", result);
      if (!result.rows.length) {
        const res = await pool.query(
          "INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)",
          [first_name, last_name, email, accessToken]
        );

        console.log("res", res);
      }
      const user = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
      console.log(user);
      cb(null, user.rows[0]);
    }
  )
);

module.exports = passport;
