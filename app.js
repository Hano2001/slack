const app = require("express")();

const http = require("http").Server(app);
const io = require("socket.io")(http);

const express = require("express");
app.use("/public", express.static("public"));

io.on("connection", (socket) => {
  console.log("User connected");
});

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

http.listen(3001);
