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
