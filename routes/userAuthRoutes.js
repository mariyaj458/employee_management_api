const express = require("express");
const passport = require("passport");
const User = require("../models/user");
const authenticate = require("../authenticate");

const router = express.Router();

router.post("/signup", async (req, res) => {
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
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  (req, res) => {
    const token = authenticate.getToken({ _id: req.user._id });

    res.status(200).json({
      success: true,
      message: "You are successfully logged in!",
      token,
    });
  }
);

router.get("/logout", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

module.exports = router;
