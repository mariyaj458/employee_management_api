const express = require("express");
const passport = require("passport");
const { signup, login, logout } = require("../controllers/userAuthController");

const router = express.Router();

router.post("/signup", signup);

router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  login
);

router.get("/logout", logout);

module.exports = router;
