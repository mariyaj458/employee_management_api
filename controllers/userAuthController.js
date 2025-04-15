const passport = require("passport");
const User = require("../models/user");
const authenticate = require("../authenticate");
const { createError } = require("../utils/commonErrors");

exports.signup = async (req, res, next) => {
  try {
    const newUser = new User({
      email: req.body.email,
      admin: req.body.admin || false,
    });

    const registeredUser = await User.register(newUser, req.body.password);

    passport.authenticate("local")(req, res, () => {
      const token = authenticate.getToken({ _id: registeredUser._id });
      res.status(200).json({
        success: true,
        message: "Registration Successful!",
        token,
      });
    });
  } catch (err) {
    next(createError(err.message));
  }
};

exports.login = (req, res) => {
  const token = authenticate.getToken({ _id: req.user._id });

  res.status(200).json({
    success: true,
    message: "You are successfully logged in!",
    token,
  });
};

exports.logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};
