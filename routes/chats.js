const express = require("express");
const router = express.Router();

const { ensureAuthenticated } = require("../config/auth");

//Views
const pizza = {
  title: "The Pizza Chat Room ",
};
const burgers = {
  title: "The Burger Chat Room",
};
const donuts = {
  title: "The Donut Chat Room",
};

router.get("/burgers", ensureAuthenticated, (req, res) => {
  res.render("chatroom.ejs", burgers);
});

router.get("/pizza", ensureAuthenticated, (req, res) => {
  res.render("chatroom.ejs", pizza);
});
router.get("/donuts", ensureAuthenticated, (req, res) => {
  res.render("chatroom.ejs", donuts);
});

module.exports = router;
