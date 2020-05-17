const Campground = require("../models/campground");
const Comment = require("../models/comment");

// Wrapper obj for all the middlewares
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, foundcmp) => {
      if (err) {
        req.flash("error", "Campground not found!");
        res.redirect("back");
      } else {
        /*
          Check if user owns campground
          one is an object the other is a string so 
          .equals is used  
        */
        if (foundcmp.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You don't have permission to do that!");
          res.redirect("back"); // redirect to the previous page
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in!");
    res.redirect("back");
  }
};

middlewareObj.checkCommentOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundcomm) => {
      if (err) {
        res.redirect("back");
      } else {
        /*
          Check if user owns comment
          one is an object the other is a string so 
          .equals is used  
        */
        if (foundcomm.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You do not have permission to do that!");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in!");
    res.redirect("back");
  }
};

middlewareObj.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You need to log in first!");
  res.redirect("/login");
};

module.exports = middlewareObj;
