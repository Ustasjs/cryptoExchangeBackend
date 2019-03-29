const passport = require("passport");
const passportJWT = require("passport-jwt");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const User = mongoose.model("user");
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const params = {
  secretOrKey: process.env.SEKRET_KEY,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  passReqToCallback: true
};

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(
  "loginUsers",
  new LocalStrategy(
    {
      usernameField: "email"
    },
    (username, password, done) => {
      User.findOne({ email: username })
        .then(user => {
          if (user && user.validPassword(password)) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        })
        .catch(err => {
          done(err);
        });
    }
  )
);

const strategy = new JwtStrategy(params, function(req, payload, done) {
  User.findById(payload.id)
    .then(user => {
      if (user) {
        req.user = user;
        return done(null, user);
      } else {
        return done(new Error("User not found"), null);
      }
    })
    .catch(err => {
      done(err);
    });
});

passport.use(strategy);
