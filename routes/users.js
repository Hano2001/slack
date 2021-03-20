const express = require("express");
const app = express();
const router = express.Router();
const http = require("http").Server(app);
const User = require("../models/users");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { ensureAuthenticated } = require("../config/auth");
const Socket = require("socket.io");
const io = require("socket.io")(http);
const path = require("path");
const fileUpload = require("express-fileupload");

router.use(
  fileUpload({
    createParentPath: true,
  })
);

//Login

router.get("/login", (req, res) => {
  res.render("login", { layout: false });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  }),
  (req, res) => {
    Socket.username = req.user.username;
  }
);

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
    res.render("register", {
      errors,
      name,
      email,
      username,
    });
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

//Account
router.get("/account", ensureAuthenticated, (req, res) => {
  res.render("account", { user: req.user });
});

router.post("/account/name", (req, res) => {
  User.updateOne({ _id: req.user._id }, { name: req.body.name }, (err, obj) => {
    if (err) {
      console.log(err);
    } else {
      req.flash("success_msg", "Name Changed!");

      res.redirect("/users/account");
    }
  });
});

router.post("/account/username", (req, res) => {
  User.updateOne(
    { _id: req.user._id },
    { username: req.body.username },
    (err, obj) => {
      if (err) {
        console.log(err);
      } else {
        req.flash("success_msg", "Username Changed!");
        res.redirect("/users/account");
      }
    }
  );
});

router.post("/account/email", (req, res) => {
  User.updateOne(
    { _id: req.user._id },
    { email: req.body.email },
    (err, obj) => {
      if (err) {
        console.log(err);
      } else {
        req.flash("success_msg", "E-mail Changed!");
        res.redirect("/users/account");
      }
    }
  );
});

router.post("/account/profile-pic", (req, res) => {
  console.log(req.body.files);
  try {
    if (req.files) {
      let profilePic = req.files.profile_pic;
      let fileName = `../public/uploads/${profilePic.name}`;
      console.log(fileName);

      profilePic.mv(`./public/uploads/${profilePic.name}`);

      User.updateOne(
        { _id: req.user._id },
        { picture: fileName },
        (err, obj) => {
          if (err) {
            console.log(err);
          } else {
            req.flash("success_msg", "Profile picture updated!");
            res.redirect("/users/account");
          }
        }
      );
    } else {
      console.log("ERROR");
      req.flash("erro_msg", "something went wrong");
      res.redirect("/users/account");
    }
  } catch (error) {
    res.send(error);
  }
});
//Socket
io.on("disconnect", () => {
  router.get("/logout", (req, res) => {
    req.logOut();
    req.flash("success_msg", "You've been logged out");
    User.updateOne(
      { username: req.user.username },
      { online: false },
      (err, obj) => {
        if (err) {
          console.log(err);
        } else {
          console.log(obj);
        }
        res.redirect("/users/login");
      }
    );
  });
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
      // console.log(obj);
      // console.log(username);
    }
    res.redirect("/users/login");
  });
});

module.exports = router;
