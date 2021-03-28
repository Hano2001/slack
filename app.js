const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const socketio = require("socket.io");
const path = require("path");
const port = 3000;
const io = socketio(server);
const expressEjsLayouts = require("express-ejs-layouts");
const session = require("express-session");
const mongoose = require("mongoose");
const router = express.Router();
const flash = require("connect-flash");
const passport = require("passport");
require("./config/passport")(passport);
const roomModel = require("./models/rooms");
const userModel = require("./models/users");
const messageFormat = require("./config/messages");
const { userJoin, currentUser } = require("./config/chatUsers");

//Sockets
const adminName = "SlackcopyCat";
let onlineUser = "";

io.on("connection", (socket) => {
  //Updates list of online users
  socket.on("userOnline", (userId) => {
    onlineUser = userId;
    userModel.updateOne(
      { _id: userId },
      { online: true, socketId: socket.id },
      (err, obj) => {
        if (err) {
          console.log(err);
        } else {
          console.log(obj);
        }
      }
    );
  });

  //Room sockets
  socket.on("joinRoom", ({ userId, username, roomId }) => {
    const user = userJoin(userId, username, roomId);
    socket.join(user.roomId);

    socket.emit("message", messageFormat(adminName, "Welcome to the Room!"));

    socket.broadcast
      .to(user.roomId)
      .emit(
        "message",
        messageFormat(adminName, `${user.username} has entered the room!`)
      );

    socket.on("chatMessage", (message) => {
      let messageInfo = {
        message: message.text,
        sender: message.username,
      };
      roomModel.updateOne(
        { _id: user.roomId },
        { $push: { messages: messageInfo } },
        (err, obj) => {
          if (err) {
            console.log(err);
          } else {
            console.log(obj);
          }
        }
      );

      io.to(user.roomId).emit(
        "message",
        messageFormat(user.username, message.text)
      );
    });

    console.log("User connected");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

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
    cookie: { _expires: 6000000000 },
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

//Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

app.use("/dashboard", require("./routes/dashboard"));

app.get("/", (req, res) => {
  res.render("index.ejs");
  console.log("Up and running!");
});

server.listen(port, () => console.log(`server running on ${port}`));
