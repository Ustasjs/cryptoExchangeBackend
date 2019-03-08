var express = require("express");
var router = express.Router();
const jwt = require("jwt-simple");
const passport = require("passport");

router.post("/", function(req, res, next) {
  passport.authenticate("loginUsers", (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res
        .status(401)
        .json({ message: "Укажите правильный логин и пароль!" });
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      var payload = {
        id: user.id
      };
      var token = jwt.encode(payload, process.env.SEKRET_KEY);
      res.json({ jwt: token });
    });
  })(req, res, next);
});

module.exports = router;
