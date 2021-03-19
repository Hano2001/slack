const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const connection = mongoose.connect("mongodb://localhost:27017/slackcopy");
const db = mongoose.connection;
const { ensureAuthenticated } = require("../config/auth");
const userModel = require("../models/users");

router.get("/", (req, res) => {
  res.render("start", { layout: false });
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  const id = req.user._id;
  let users = {};
  userModel.updateOne({ _id: id }, { online: true }, (err, obj) => {
    if (err) {
      console.log(err);
    } else {
      // console.log(obj);
    }
  });
  userModel.find({ online: true }, (err, obj) => {
    if (err) {
      console.log(err);
    } else {
      res.render("dashboard", { user: req.user, onlineusers: obj });
    }
  });

  // console.log(users);
});

module.exports = router;
