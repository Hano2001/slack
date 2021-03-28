const express = require("express");
const app = express();
const router = express.Router();
const User = require("../models/users");
const bcrypt = require("bcrypt");
const passport = require("passport");

//Login

router.get("/login", (req, res) => {
  res.render("login", { layout: false });
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

//Register

router.get("/register", (req, res) => {
  res.render("register", { layout: false });
});

router.post("/register", (req, res) => {
  const { name, username, email, password, passwordconfirm } = req.body;
  let errors = [];

  console.log(
    `Name: ${name} username: ${username} email: ${email} password: ${password}`
  );

  if (!name || !username || !email || !password) {
    errors.push({ msg: "Make sure to fill out all fields!" });
  }

  if (password.length < 8) {
    errors.push({ msg: "Your password needs to be at least 8 characters!" });
  }

  if (password != passwordconfirm) {
    errors.push({ msg: "You're passwords don't match!" });
  }

  if (errors.length > 0) {
    res.render("register", { layout: false, errors, name, email, username });
  } else {
    const newUser = new User({
      name,
      username,
      email,
      password,
    });

    bcrypt.hash(password, 10, function (error, hash) {
      newUser.password = hash;

      newUser
        .save()
        .then((value) => {
          req.flash("success_msg", "You have now been registered!");
          res.redirect("/users/login");
        })
        .catch((error) => console.log(error));
    });
  }
});

//Log out
router.get("/logout", (req, res) => {
  username = req.user.username;
  req.logOut();
  req.flash("success_msg", "You logged out!");

  User.updateOne({ username: username }, { online: false }, (err, obj) => {
    if (err) {
      console.log(err);
    } else {
    }
    res.redirect("/users/login");
  });
});

module.exports = router;
