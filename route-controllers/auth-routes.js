const router = require("express").Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const Merchant = require("../db/models/merchant-model");
const Courier = require("../db/models/courier-model");
const Location = require("../db/models/courier-locations");
const cors = require("cors");

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
                    if (!newUser) res.send(false);
                    res.send(true);
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
  passport.authenticate("local", {
    failureMessage: true,
  }),
  function (req, res) {
    console.log(req.user)
    // req.session.user = req.user;
    res.send({ ...req.user, token: req.user._id + "@" + req.user.email });
  }
);

router.get("/signout", function (req, res) {
  req.logout(function (err) {
    if (err) res.send(false);
    console.log("signed out");
    req.session.destroy();
    res.send(true);
  });
});

module.exports = router;
