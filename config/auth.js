module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      req.flash("error_msg", "Please login to take part of this page");
      res.redirect("/users/login");
    }
  },

  adminAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.username === "ADMIN") {
        return next();
      } else {
        req.flash("error_msg", "You don't have ADMIN access to this page");
        res.redirect("/dashboard");
      }
    }
  },
};
