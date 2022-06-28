const router = require("express").Router();
const Courier = require("../db/models/courier-model");

router.post("/getCourier", function (req, res) {
  var id = req.body.id;
  Courier.findById(id)
    .then((currentUser) => {
      if (currentUser) {
        console.log(currentUser);
        res.send(currentUser);
      } else res.send("Error Fetching User");
    })
    .catch((err) => {
      res.send(err);
    });
});

router.post("/set-profile", (req, res) => {
  console.log(req.body.email);
  Courier.updateOne(
    { email: req.body.email },
    { logo: req.body.logo, description: req.body.description }
  )
    .then((update) => {
      console.log(update);
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
