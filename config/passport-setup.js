const passport = require("passport");
const LocalStrategy = require("passport-local");
const Merchant = require("../db/models/merchant-model");
const Courier = require("../db/models/courier-model");
const bcrypt = require("bcrypt");
var express = require("express");

// passport.deserializeUser(function (user, cb) {
//   console.log("at deserial " + user);
//   return cb(null, user);
// });

passport.use(
  new LocalStrategy({ usernameField: "email" }, function verify(
    email,
    password,
    done
  ) {
    Courier.findOne({ email: email })
      .then((currentUser) => {
        if (currentUser) {
          // Decrypt password and compare
          bcrypt.compare(password, currentUser.hash).then(function (result) {
            if (!result) {
              return done(null, false);
            }
            return done(null, currentUser);
          });
        } else {
          Merchant.findOne({ email: email })
            .then((currentUser) => {
              if (!currentUser) {
                return done(null, false);
              }
              // Decrypt password and compare
              bcrypt
                .compare(password, currentUser.hash)
                .then(function (result) {
                  if (!result) {
                    return done(null, false);
                  }
                  return done(null, currentUser);
                });
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  })
);

// passport.serializeUser(function (user, done) {
//   console.log("at serial " + user._id);
//   done(null, user._id);
// });

passport.serializeUser(function (user, cb) {
  console.log("at serial " + user.id);
  cb(null, { id: user.id, username: user.email });
});

// passport.deserializeUser(function (user, done) {
//   console.log("at seral " + user.id);
//   Courier.findById(user.id).then((user) => {
//     if (user) {
//       done(null, user);
//     }
//   });
//   Merchant.findById(user.id).then((user) => {
//     if (!user) {
//       done(null, false);
//     }
//     done(null, user);
//   });
// });

passport.deserializeUser((req, user, done) => {
  console.log("at serial " + user.id);
  Courier.findById(user.id).then((user) => {
    if (user) {
      done(null, user);
    }
  });
  Merchant.findById(user.id).then((user) => {
    if (!user) {
      done(null, false);
    }
    done(null, user);
  });
});
