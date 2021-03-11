const express = require("express");
const router = express.Router();

const User = require("../models/users");
const bcrypt = require("bcrypt");
const passport = require("passport");

//Login

router.get("/login", (req, res) => {
  res.render("login");
});

//Register

router.get("/register", (req, res) => {
  res.render("register");
});

module.exports = router;
