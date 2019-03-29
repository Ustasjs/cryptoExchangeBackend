const jwt = require("jwt-simple");
const passport = require("passport");

module.exports.getToken = (req, res, next) => {
  passport.authenticate("loginUsers", (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: "Email or password is invalid" });
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      const payload = {
        id: user.id
      };
      const token = jwt.encode(payload, process.env.SEKRET_KEY);
      res.json({ jwt: token });
    });
  })(req, res, next);
};
