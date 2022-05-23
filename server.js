const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const mongoose = require("mongoose");
var ensureLogin = require("connect-ensure-login").ensureLoggedIn;
var ensureLoggedIn = ensureLogin();
const bcrypt = require("bcrypt");
const cors = require("cors");
const passportSetup = require("./config/passport-setup");
const authRoute = require("./route-controllers/auth-routes");
const app = express();
const courierRoute = require("./route-controllers/courierRoutes");

app.set("port", process.env.PORT || 3003);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("../Codes/CourierFinder/App/build"));
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  cors({
    origin: "http://localhost:3002", // <-- location of the react app were connecting to
    credentials: true,
  })
);

app.use(
  require("express-session")({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    // maxAge: 3600000
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/courier", courierRoute);
app.use("/auth", authRoute);

// app.get('/login', (req, res) => {
//      res.redirect('http://localhost:3002/auth/signin');
//  });

app.get("/getCourier", ensureLoggedIn, function (req, res) {
  console.log(req.user);
  res.send(req.user);
});

//Mongo DB connect
//mongoose connection
mongoose
  .connect(
    "mongodb+srv://Alexius:emmanuel093@datacluster.f2vtb.mongodb.net/DataCluster?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then((result) =>
    //Wait for DB connection before starting Express Server
    app.listen(app.get("port"), () => {
      console.log(`Find the server at: http://localhost:${app.get("port")}`);
    })
  )
  .catch((err) => console.log(err));
