const user = require("../models/user.js");

// SIGN UP POST
module.exports.SignupPostRoute = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newuser = new user({ username, email });
    const registedUser = await user.register(newuser, password);
    req.login(registedUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("usercreated", "Sucessfully Created New user!");
      res.redirect("/listing");
    });
  } catch (e) {
    req.flash("err", e.message);
    res.redirect("/signup");
  }
};

//SIGNUP GET ROUTE
module.exports.SignUpGetRoute = (req, res) => {
  res.render("./users/signup.ejs");
};

// LOGIN GET ROUTE
module.exports.LogInGetRoute = (req, res) => {
  res.render("./users/login.ejs");
};

//LOG IN POST ROUTE
module.exports.LogInPostRoute = async (req, res) => {
  try {
    req.flash("success", "Successfully Logged In!");
    let redirectUrl = res.locals.redirectUrl || "/listing"; // Get redirect URL from res.locals or default to /listing
    res.redirect(redirectUrl); // Redirect user to the determined URL
  } catch (err) {
    req.flash("error", "Failed to log in."); // Set flash message for error
    res.redirect("/login"); // Redirect to /login page on error
  }
};

//LOGOUT ROUTE
module.exports.LogoutRoute = (req, res, next) => {
  req.logout((e) => {
    if (e) {
      return next(err);
    }
    req.flash("success", "you are logged out!");
    res.redirect("/listing");
  });
};
