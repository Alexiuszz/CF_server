const router = require("express").Router();
const Courier = require("../db/models/courier-model");
const passport = require("passport");

router.post("/getCourier", function (req, res) {
  // if (!req.session.user) {
  //   return res.sendStatus(401);
  // }
  console.log(req.user);
  res.send(req.user);
});

router.post("/set-profile", (req, res) => {
  // if (!req.session.user) {
  //   return res.sendStatus(401);
  // }
  Courier.updateOne(
    { email: req.body.email },
    { logo: req.body.logo, description: req.body.description }
  )
    .then((update) => {
      Courier.updateOne(
        { email: req.body.email },
        { createdProfile: update.acknowledged }
      ).catch((err) => console.log(err));
      console.log(update.acknowledged);
      res.send(update.acknowledged);
    })
    .catch((err) => console.log(err));
});

module.exports = router;
