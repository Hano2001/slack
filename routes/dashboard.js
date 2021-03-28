const express = require("express");
const router = express.Router();
const { ensureAuthenticated, adminAuthenticated } = require("../config/auth");
const userModel = require("../models/users");
const roomModel = require("../models/rooms");
const Room = require("../models/rooms");
const bcrypt = require("bcrypt");
const fileUpload = require("express-fileupload");

router.use(
  fileUpload({
    createParentPath: true,
  })
);

router.get("/", ensureAuthenticated, (req, res) => {
  userModel.find({}, (err, obj) => {
    if (err) {
      console.log(err);
    } else {
      let onlineUsers = [];
      let offlineUsers = [];
      for (user of obj) {
        if (user.username != "ADMIN") {
          if (user.online === true) {
            onlineUsers.push(user);
          } else {
            offlineUsers.push(user);
          }
        }
      }

      res.render("dashboard", {
        user: req.user,
        onlineUsers: onlineUsers,
        offlineUsers: offlineUsers,
      });
    }
  });
});
//ADMIN ROUTES
router.get("/admin", adminAuthenticated, (req, res) => {
  userModel.find({}, (err, obj) => {
    if (err) {
      console.log(err);
    } else {
      let users = [];
      for (user of obj) {
        if (user.username != "ADMIN") {
          users.push(user);
        }
      }
      res.render("admin", { users: users, layout: false });
    }
  });
});

router.get("/admin/deleteuser/:id", (req, res) => {
  id = req.params.id;
  userModel.deleteOne({ _id: id }, (err, obj) => {
    if (err) {
      console.log(err);
    } else {
      req.flash("success_msg", "User deleted!");
      res.redirect("/dashboard/admin");
    }
  });
});

router.get("/admin/resetpassword/:id", (req, res) => {
  id = req.params.id;
  bcrypt.hash("password", 10, (error, hash) => {
    if (error) {
      console.log(error);
    } else {
      userModel.updateOne({ _id: id }, { password: hash }, (err, obj) => {
        if (err) {
          console.log(err);
        } else {
          req.flash("success_msg", "Password reset!");
          res.redirect("/dashboard/admin");
        }
      });
    }
  });
});

//Chat Rooms

router.get("/chatrooms", (req, res) => {
  roomModel
    .find({})
    .populate("starter")
    .exec(function (err, room) {
      rooms = [];
      if (err) {
        console.log(err);
      } else {
        for (item of room) {
          rooms.push(item);
        }
      }
      res.render("chatrooms", { user: req.user, rooms: rooms });
    });
});

router.post("/chatrooms", (req, res) => {
  const name = req.body.name;
  const starter = req.user._id;

  const newRoom = new Room({
    name,
    starter,
  });

  newRoom.save().then((value) => {
    req.flash("success_msg", `Room ${name} created!`);
    res.redirect("/dashboard/chatrooms");
  });
});

router.get("/chatrooms/:id", (req, res) => {
  const id = req.params.id;
  roomModel
    .findOne({ _id: id })
    .populate("starter")
    .exec((err, room) => {
      if (err) {
        console.log(err);
      } else {
        res.render("room", { room, user: req.user });
      }
    });
});

router.get("/deleteroom/:id", (req, res) => {
  const id = req.params.id;
  roomModel.deleteOne({ _id: id }, (err, obj) => {
    if (err) {
      console.log(err);
    } else {
      req.flash("success_msg", "Room deleted!");
      res.redirect("/dashboard/chatrooms");
    }
  });
});

//Account
router.get("/account", ensureAuthenticated, (req, res) => {
  res.render("account", { user: req.user });
});

router.post("/account/name", (req, res) => {
  userModel.updateOne(
    { _id: req.user._id },
    { name: req.body.name },
    (err, obj) => {
      if (err) {
        console.log(err);
      } else {
        req.flash("success_msg", "Name Changed!");

        res.redirect("/dashboard/account");
      }
    }
  );
});

router.post("/account/username", (req, res) => {
  userModel.updateOne(
    { _id: req.user._id },
    { username: req.body.username },
    (err, obj) => {
      if (err) {
        console.log(err);
      } else {
        req.flash("success_msg", "Username Changed!");
        res.redirect("/dashboard/account");
      }
    }
  );
});

router.post("/account/email", (req, res) => {
  userModel.updateOne(
    { _id: req.user._id },
    { email: req.body.email },
    (err, obj) => {
      if (err) {
        console.log(err);
      } else {
        req.flash("success_msg", "E-mail Changed!");
        res.redirect("/dashboard/account");
      }
    }
  );
});
router.post("/account/password", (req, res) => {
  let id = req.user.id;
  let password = req.body.password;
  bcrypt.hash(password, 10, (error, hash) => {
    if (error) {
      console.log(error);
    } else {
      userModel.updateOne({ _id: id }, { password: hash }, (err, obj) => {
        if (err) {
          console.log(err);
        } else {
          req.flash("success_msg", "Password Updated!");
          res.redirect("/dashboard/account");
        }
      });
    }
  });
});

router.post("/account/profile-pic", (req, res) => {
  try {
    if (req.files) {
      let profilePic = req.files.profile_pic;
      let fileName = `../public/uploads/${profilePic.name}`;

      profilePic.mv(`./public/uploads/${profilePic.name}`);

      userModel.updateOne(
        { _id: req.user._id },
        { picture: fileName },
        (err, obj) => {
          if (err) {
            console.log(err);
          } else {
            req.flash("success_msg", "Profile picture updated!");
            res.redirect("/dashboard/account");
          }
        }
      );
    } else {
      console.log("ERROR");
      req.flash("erro_msg", "something went wrong");
      res.redirect("/dashboard/account");
    }
  } catch (error) {
    res.send(error);
  }
});

router.get("/account-delete/:id", (req, res) => {
  let id = req.params.id;

  userModel.deleteOne({ _id: id }, (err, obj) => {
    if (err) {
      console.log(err);
    } else {
      req.flash("success_msg", "Account deleted!");
      res.redirect("/users/login");
    }
  });
});

module.exports = router;
