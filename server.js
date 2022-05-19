const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const passportSetup = require('./config/passport-setup');
const authRoute = require("./route-controllers/auth-routes");
const app = express();

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

app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


app.use('/auth', authRoute);

// app.get('/', (req, res) => {
//     res.send('<h1>Hello</h1>');
// });

//Mongo DB connect
//mongoose connection
mongoose.connect('mongodb+srv://Alexius:emmanuel093@datacluster.f2vtb.mongodb.net/DataCluster?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) =>
        //Wait for DB connection before starting Express Server
        app.listen(app.get("port"), () => {
            console.log(`Find the server at: http://localhost:${app.get("port")}`)
        })
    )
    .catch((err) => console.log(err));