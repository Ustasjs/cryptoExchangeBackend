const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bCrypt = require("bcryptjs");
const helpers = require("@helpers");

const UserSchema = new Schema({
  email: {
    type: String,
    required: [true, "Укажите логин"]
  },
  wallet: {
    usd: {
      type: Number,
      required: [true, "Укажите сумму в usd"]
    },
    btc: {
      type: Number,
      required: [true, "Укажите сумму в btc"]
    },
    eth: {
      type: Number,
      required: [true, "Укажите сумму в eth"]
    }
  },
  hash: String
});

UserSchema.methods.setPassword = function(password) {
  this.hash = helpers.createHash(password);
};

UserSchema.methods.validPassword = function(password) {
  return bCrypt.compareSync(password, this.hash);
};

mongoose.model("user", UserSchema);
