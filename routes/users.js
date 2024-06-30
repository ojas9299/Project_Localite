const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveredirectUrl } = require("../middleware.js");
const UsersController = require("../controllers/user.js");

router.get("/signup", UsersController.SignUpGetRoute);

router.post("/signup", wrapAsync(UsersController.SignupPostRoute));

router.get("/login", UsersController.LogInGetRoute);

router.post(
  "/login",
  saveredirectUrl, // Ensure saveredirectUrl middleware is defined and correctly implemented
  passport.authenticate("local", {
    failureRedirect: "/login", // Redirect to /login on authentication failure
    failureFlash: true, // Enable flash messages for authentication failures
  }),
  wrapAsync(UsersController.LogInPostRoute)
);

router.get("/logout", UsersController.LogoutRoute);

module.exports = router;
