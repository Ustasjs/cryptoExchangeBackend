const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const currenciesSymbols = require("@helpers").currenciesSymbols;

const commonShema = {
  mts: Number,
  high: Number,
  low: Number,
  sell: Number,
  purchase: Number
};

const returnCurrency = currency => () => currency;

const BtcShema = new Schema(commonShema);
BtcShema.statics.getCurrency = returnCurrency(currenciesSymbols.BTC);
mongoose.model(currenciesSymbols.BTC, BtcShema);

const EthShema = new Schema(commonShema);
EthShema.statics.getCurrency = returnCurrency(currenciesSymbols.ETH);
mongoose.model(currenciesSymbols.ETH, EthShema);
