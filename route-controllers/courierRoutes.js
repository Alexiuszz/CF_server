const router = require("express").Router();
const Courier = require("../db/models/courier-model");
const cors = require("cors");
const passport = require("passport");


router.get("/getCourier", function (req, res) {
  console.log(req.session.user);
  res.send(req.session.user);
});

router.post("/set-profile", (req, res) => {
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
