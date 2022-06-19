const express = require("express");
var sessionstore = require("sessionstore");
var cookieParser = require("cookie-parser");
var session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
var logger = require("morgan");
var ensureLogIn = require("connect-ensure-login").ensureLoggedIn;

var ensureLoggedIn = ensureLogIn();
const cors = require("cors");
const passportSetup = require("./config/passport-setup");

const authRoute = require("./route-controllers/auth-routes");
const courierRoute = require("./route-controllers/courierRoutes");

const app = express();

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
  res.redirect("http://https://62af9cecb37d4a1cb699cd32--courier-finder.netlify.app/#/signin");
});

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
