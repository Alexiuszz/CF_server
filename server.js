const express = require("express");
var sessionstore = require("sessionstore");
var cookieParser = require("cookie-parser");
var session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
var logger = require("morgan");
var ensureLogIn = require("connect-ensure-login").ensureLoggedIn;
require('dotenv').config();
var ensureLoggedIn = ensureLogIn();
const cors = require("cors");
const passportSetup = require("./config/passport-setup");

const authRoute = require("./route-controllers/auth-routes");
const courierRoute = require("./route-controllers/courierRoutes");

const app = express();

app.set("gKey", process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
app.set("port", process.env.PORT || 3003);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("../Codes/CourierFinder/build"));
}

app.use(logger("dev"));
app.use(
  cors({
    origin: "http://localhost:3002", // <-- location of the react app were connecting to
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("keyboard cat"));

app.use(
  session({
    secret: "keyboard cat",
    store: sessionstore.createSessionStore(),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    // maxAge: 3600000
  })
);

// app.use(passport.initialize());
app.use(passport.authenticate("session"));

app.use("/courier", ensureLoggedIn, courierRoute);
app.use("/auth", authRoute);

app.get("/login", (req, res) => {
  res.redirect("https://master--courier-finder.netlify.app/#/signin");
});

app.get("/api/google-key", (req, res) => {
  if (req.body.key == process.env.KEY) {
    res.json({key: app.get("gKey")});
  }
});

app.get('/', (req, res) => {
  res.send(process.env.KEY);
})
// app.get("/getCourier", function (req, res) {
//   console.log(req.session.user);
//   res.send(req.session.user);
// });

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
