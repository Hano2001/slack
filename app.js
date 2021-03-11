const app = require("express")();

const http = require("http").Server(app);
const io = require("socket.io")(http);

const express = require("express");
const expressEjsLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const router = express.Router();

app.use("/public", express.static("public"));
app.set("view engine", "ejs");

//Mongoose
mongoose
  .connect("mongodb://localhost:27017/slackcopy")
  .then(() => console.log("Connected to DB"))
  .catch((error) => console.log(error));

//Sockets
io.on("connection", (socket) => {
  console.log("User connected");
});

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

app.get("/", (req, res) => {
  res.render("index.ejs");
  console.log("Up and running!");
});

app.get("/burgers", (req, res) => {
  res.render("chatroom.ejs", burgers);
});

app.get("/pizza", (req, res) => {
  res.render("chatroom.ejs", pizza);
});
app.get("/donuts", (req, res) => {
  res.render("chatroom.ejs", donuts);
});

//Routes
app.use("/users", require("./routes/users"));
http.listen(3000);
