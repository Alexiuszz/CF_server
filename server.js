const express = require("express");
var cookieParser = require("cookie-parser");
var session = require("express-session");
const MongoStore = require("connect-mongo");

const passport = require("passport");
const mongoose = require("mongoose");
var logger = require("morgan");
var ensureLogIn = require("connect-ensure-login").ensureLoggedIn;
var ensureLoggedIn = ensureLogIn();
const cors = require("cors");
const passportSetup = require("./config/passport-setup");

const authRoute = require("./route-controllers/auth-routes");
const courierRoute = require("./route-controllers/courierRoutes");

const { isAuthenticated } = require("./middleware/isAuthenticated");

const app = express();

app.set("port", process.env.PORT || 3003);

var baseUrl = "";
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1); // trust first proxy
  app.use(express.static("../Codes/CourierFinder/build"));
  baseUrl = "https://emissar.netlify.app";
} else {
  baseUrl = "http://localhost:3002";
}
app.use(logger("dev"));

var whitelist = [
  "http://localhost:3002",
  "https://emissar.netlify.app",
];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(origin, "Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.enable("trust proxy", true);
app.use(express.json({ limit: "500kb" }));
app.use(express.urlencoded({ limit: "500kb", extended: true }));
app.use(cookieParser("keyboard cat"));

app.use(
  session({
    secret: "keyboard cat",
    // store: sessionstore.createSessionStore(),
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://Alexius:emmanuel093@datacluster.f2vtb.mongodb.net/DataCluster?retryWrites=true&w=majority",
      // crypto: {
      //   secret: "squirrel",
      // },
      ttl: 4 * 60 * 60,
      autoRemove: "interval",
      autoRemoveInterval: 10,
    }),

    resave: false,
    saveUninitialized: true,
    name: "myapp",
    cookie: {
      httpOnly: true,
      secure: true,
      // sameSite: "none",
    },
    // maxAge: 3600000
  })
);

app.use(passport.initialize());
app.use(passport.authenticate("session"));
app.use(passport.session());

// app.use("/courier", ensureLoggedIn, courierRoute);
app.use("/courier", isAuthenticated, courierRoute);
app.use("/auth", authRoute);

app.get("/login", (req, res) => {
  res.redirect(`${baseUrl}/#/signin`);
});

app.get("/", (req, res) => {
  res.send(process.env.NODE_ENV);
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
      console.log(
        `Find the server at: http://localhost:${app.get("port")}`
      );
    })
  )
  .catch((err) => console.log(err));
