const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");
const User = require("./models/user");

passport.use(
  new LocalStrategy({ usernameField: "email" }, User.authenticate())
);
require("dotenv").config();

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload._id);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

const blacklistedTokens = new Set();

exports.blacklistToken = (token) => {
  blacklistedTokens.add(token);
};

exports.isTokenBlacklisted = (token) => {
  return blacklistedTokens.has(token);
};

exports.getToken = function (user) {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });
};

exports.verifyUser = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (exports.isTokenBlacklisted(token)) {
      return res
        .status(401)
        .json({ success: false, message: "Token has been invalidated." });
    }
    if (err || !user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    req.user = user;
    next();
  })(req, res, next);
};
