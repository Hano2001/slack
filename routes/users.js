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

router.post("/register", (req, res) => {
  const { name, username, email, password } = req.body;
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
  }
});

module.exports = router;
