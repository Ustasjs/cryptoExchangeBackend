const bCrypt = require("bcryptjs");

module.exports.createHash = function(password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};
