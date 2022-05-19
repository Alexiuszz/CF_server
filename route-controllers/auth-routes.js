const router = require("express").Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const connectEnsureLogin = require("connect-ensure-login");
const Merchant = require("../db/models/merchant-model");
const Courier = require("../db/models/courier-model");
const Location = require("../db/models/courier-locations");
const cors = require("cors");

router.get(
  "/getUser",
  require("connect-ensure-login").ensureLoggedIn(),
  function (req, res) {
    console.log(req.user);
    res.send(req.user);
  }
);

router.post("/new-courier", (req, res) => {
  Courier.findOne({ email: req.body.email })
    .then((currentUser) => {
      if (currentUser) {
        res.send(false);
      } else {
        Merchant.findOne({ email: req.body.email })
          .then((currentUser) => {
            if (currentUser) {
              res.send(false);
            } else {
              const saltRounds = 5;

              //Encrpyt password before saving
              bcrypt.hash(req.body.password, saltRounds).then(function (hash) {
                new Location({
                  email: req.body.email,
                  locations: req.body.address,
                }).save();

                new Courier({
                  email: req.body.email,
                  hash: hash,
                  name: req.body.name,
                  phoneNo: req.body.phone,
                  locations: req.body.address,
                })
                  .save()
                  .then((newUser) => {
                    res.send(newUser);
                  });
              });
            }
          })
          .catch((err) => console.log(err));
      }
    })
    .catch((err) => console.log(err));
});

router.post("/new-merchant", (req, res) => {
  Courier.findOne({ email: req.body.email })
    .then((currentUser) => {
      if (currentUser) {
        res.send(false);
      } else {
        Merchant.findOne({ email: req.body.email })
          .then((currentUser) => {
            if (currentUser) {
              res.send(false);
            } else {
              const saltRounds = 5;

              //Encrpyt password before saving
              bcrypt.hash(req.body.password, saltRounds).then(function (hash) {
                new Merchant({
                  email: req.body.email,
                  hash: hash,
                  companyName: req.body.companyName,
                })
                  .save()
                  .then((newUser) => {
                    res.send(newUser);
                  });
              });
            }
          })
          .catch((err) => console.log(err));
      }
    })
    .catch((err) => console.log(err));
});

router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/" }),
  function (req, res) {
    console.log(req.user);
    res.send({...req.user, token: req.user._id + "@" + req.user.email});
  }
);

router.get("/signout", function (req, res) {
  req.session.destroy(function (err) {
    console.log("out");
    req.logout();
    res.send(true);
  });
});

module.exports = router;
