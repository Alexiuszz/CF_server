const Session = require("../db/models/session-model");

// middleware to test if authenticated
function isAuthenticated(req, res, next) {
  var id = req.body.token;
  console.log(id);

  Session.findById(id)
    .then((curSession) => {
      // console.log(curSession);
      if (curSession)
        next();
      else
        res.send({ sess: false });
    })
    .catch((err) => {
      console.log(err);
    });
}
exports.isAuthenticated = isAuthenticated;
