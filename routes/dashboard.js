const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const connection = mongoose.connect("mongodb://localhost:27017/slackcopy");
const db = mongoose.connection;
const { ensureAuthenticated } = require("../config/auth");
const userModel = require("../models/users");
const roomModel = require("../models/rooms");
const Room = require("../models/rooms");
let rooms = [{}];
const path = require("path");
const fileUpload = require("express-fileupload");

router.use(
  fileUpload({
    createParentPath: true,
  })
);

router.get("/", ensureAuthenticated, (req, res) => {
  //let onlineusers = [{}];
  userModel.find({ online: true }, (err, obj) => {
    if (err) {
      console.log(err);
    } else {
      let onlineusers = obj;
      console.log(onlineusers);
      res.render("dashboard", {
        user: req.user,
        onlineusers: onlineusers,
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
      if (err) {
        console.log(err);
      } else {
        rooms = [{}];
        for (item of room) {
          rooms.push(item);
        }
        res.render("chatrooms", { user: req.user, rooms: rooms });
      }
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
    console.log(`room ${name} created!`);
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
      console.log(obj);
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

router.post("/account/profile-pic", (req, res) => {
  console.log(req.body.files);
  try {
    if (req.files) {
      let profilePic = req.files.profile_pic;
      let fileName = `../public/uploads/${profilePic.name}`;
      console.log(fileName);

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

module.exports = router;
