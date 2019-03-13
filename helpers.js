const bCrypt = require("bcryptjs");
const passport = require("passport");

module.exports.createHash = function(password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

module.exports.authenticate = passport.authenticate("jwt", {
  session: false
});

module.exports.currenciesSymbols = {
  BTC: "BTC",
  ETH: "ETH"
};

module.exports.offsetUnitMilliseconds = {
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000
};

module.exports.getLatestRecord = Shema => {
  return Shema.findOne()
    .sort({ mts: -1 })
    .limit(1);
};

module.exports.ValidationError = class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
};
