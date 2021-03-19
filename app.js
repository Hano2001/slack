const express = require("express");
const app = require("express")();

const http = require("http").Server(app);
const io = require("socket.io")(http);
const path = require("path");

const expressEjsLayouts = require("express-ejs-layouts");
const session = require("express-session");
const mongoose = require("mongoose");
const router = express.Router();
const flash = require("connect-flash");
const passport = require("passport");

require("./config/passport")(passport);

//EJS
app.set("view engine", "ejs");
app.use(expressEjsLayouts);

app.use(express.urlencoded({ extended: false }));

app.use("/public", express.static(path.join(__dirname, "public")));

//Mongoose
mongoose
  .connect("mongodb://localhost:27017/slackcopy")
  .then(() => console.log("Connected to DB"))
  .catch((error) => console.log(error));

//Session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    cookie: { _expires: 6000000000000 },
  })
);

//Passport
app.use(passport.initialize());
app.use(passport.session());

//Flash
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//Sockets
io.on("connection", (socket) => {
  console.log("User connected");
});

//Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));
app.use("/chats", require("./routes/chats"));

app.get("/", (req, res) => {
  res.render("index.ejs");
  console.log("Up and running!");
});

http.listen(3000);
