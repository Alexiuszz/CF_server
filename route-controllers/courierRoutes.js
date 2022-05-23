const router = require("express").Router();
const Courier = require("../db/models/courier-model");
const cors = require("cors");
const connectEnsureLogin = require("connect-ensure-login");
const passport = require("passport");

router.get(
  "/getCourier",
  connectEnsureLogin.ensureLoggedIn(),
  function (req, res) {
    console.log(req.user);
    res.send(req.user);
  }
);

router.post("/set-profile", connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  Courier.updateOne(
    { email: req.body.email },
    { logo: req.body.logo, description: req.body.description }
  )
    .then((response) => {
      Courier.updateOne(
        { email: req.body.email },
        { createdProfile: response.acknowledged }
      ).catch((err) => console.log(err));

      res.send(response.acknowledged);
    })
    .catch((err) => console.log(err));
});

module.exports = router;
