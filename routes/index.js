const express = require("express");
const passport = require("passport");
const User = require("../models/user");
const router = express.Router();

// Root route
router.get("/", (req, res) => {
  res.render("landing");
});

// Register form
router.get("/register", (req, res) => {
  res.render("register");
});

// Handle sign up logic
router.post("/register", (req, res) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        req.flash("error", err.message);
        return res.redirect("/register");
      }
      passport.authenticate("local")(req, res, () => {
        req.flash(
          "success",
          "Welcome to YelpCamp " +
            user.username.charAt(0).toUpperCase() +
            user.username.slice(1)
        );
        res.redirect("/campgrounds");
      });
    }
  );
});

// Login form
router.get("/login", (req, res) => {
  res.render("login");
});

// Handle log in logic
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
  }),
  (req, res) => {}
);

// Logout route
router.get("/logout", (req, res) => {
  req.logOut();
  req.flash("success", "Logged you out!");
  res.redirect("/campgrounds");
});

module.exports = router;
