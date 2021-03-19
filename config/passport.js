const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/users");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(function (username, password, done) {
      User.findOne({ username: username }, function (error, user) {
        if (error) {
          console.log("Something else");
          return done(error);
        }

        if (!user) {
          console.log("Testing");
          return done(null, false, { message: "Wrong username" });
        }
        console.log("Something");
        bcrypt.compare(password, user.password, (error, isMatch) => {
          if (error) {
            throw error;
          }

          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Wrong password" });
          }
        });
      }).catch((error) => console.log(error));
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (error, user) => {
      done(error, user);
    });
  });
};
