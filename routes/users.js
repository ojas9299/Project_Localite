const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveredirectUrl } = require("../middleware.js");
const UsersController = require("../controllers/user.js");

router
  .route("/signup")
  .get(UsersController.SignUpGetRoute)
  .post(wrapAsync(UsersController.SignupPostRoute));

router
  .route("/login")
  .get(UsersController.LogInGetRoute)
  .post(
    saveredirectUrl, // Ensure saveredirectUrl middleware is defined and correctly implemented
    passport.authenticate("local", {
      failureRedirect: "/login", // Redirect to /login on authentication failure
      failureFlash: true, // Enable flash messages for authentication failures
    }),
    wrapAsync(UsersController.LogInPostRoute)
  );

router.get("/logout", UsersController.LogoutRoute);

module.exports = router;
