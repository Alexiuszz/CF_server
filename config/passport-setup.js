const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const Merchant = require('../db/models/merchant-model');
const Courier = require('../db/models/courier-model');
const bcrypt = require('bcrypt');



passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    Courier.findById(id)
        .then((user) => {
            if (user) { done(null, user); }
        });
    Merchant.findById(id)
        .then((user) => {
            if (!user) { done(null, false); }
            done(null, user);
        });
});

passport.use(new Strategy({ usernameField: 'email' }, (email, password, done) => {
    Courier.findOne({ email: email })
        .then((currentUser) => {
            if (currentUser) {
                // Decrypt password and compare
                bcrypt.compare(password, currentUser.hash).then(function(result) {
                    if (!result) { return done(null, false); }
                    return done(null, currentUser);
                });
            } else {
                Merchant.findOne({ email: email })
                    .then((currentUser) => {
                        if (!currentUser) {
                            return done(null, false);
                        }
                        // Decrypt password and compare
                        bcrypt.compare(password, currentUser.hash).then(function(result) {
                            if (!result) { return done(null, false); }
                            return done(null, currentUser);
                        });
                    }).catch((err) => console.log(err));

            }
        }).catch((err) => console.log(err));

}));