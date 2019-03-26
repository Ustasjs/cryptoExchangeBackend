const mongoose = require("mongoose");
const jwt = require("jwt-simple");
const helpers = require("@helpers");
const User = mongoose.model("user");
var validate = require("validate.js");

const constraints = {
  email: {
    email: true,
    presence: true
  },
  password: {
    length: { minimum: 3 },
    presence: true
  }
};

function createUser(email, hash) {
  return {
    email,
    hash,
    wallet: {
      usd: 9000,
      btc: 0,
      eth: 0
    }
  };
}

module.exports.registration = (req, res, next) => {
  const {
    body: { email, password }
  } = req;
  const errors = validate(req.body, constraints);
  if (errors) {
    res.status(400).json({ result: "error", message: errors });
  } else {
    User.findOne({ email })
      .then(user => {
        if (user) {
          res.status(409).json({
            message: {
              conflict: ["User with this email already exist"]
            }
          });
        } else {
          const newUser = new User(
            createUser(email, helpers.createHash(password))
          );
          newUser
            .save()
            .then(user => {
              req.logIn(user, function(err) {
                if (err) {
                  return next(err);
                }
                var payload = {
                  id: user.id
                };
                var token = jwt.encode(payload, process.env.SEKRET_KEY);
                res.json({ result: "created", jwt: token });
              });
            })
            .catch(next);
        }
      })
      .catch(next);
  }
};

module.exports.getEmail = (req, res) => {
  res.json({ result: { email: req.user.email } });
};

module.exports.getWallet = (req, res) => {
  res.json({ result: req.user.wallet });
};
