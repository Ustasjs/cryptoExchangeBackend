const {
  currenciesSymbols,
  getLatestRecord,
  ValidationError
} = require("@helpers");
const mongoose = require("mongoose");

const ExchangeContoller = require("./ExchangeController");
const BtcSchema = mongoose.model(currenciesSymbols.BTC);
const EthSchema = mongoose.model(currenciesSymbols.ETH);
const User = mongoose.model("user");
const ShemaMap = {
  btc: BtcSchema,
  eth: EthSchema
};

module.exports.handleExchange = (req, res, next) => {
  const {
    query: { symbol, operation, sum },
    user
  } = req;
  if (!symbol || !currenciesSymbols[symbol.toUpperCase()]) {
    res.status(400).json({ result: "error", message: "incorrect symbol" });
    return;
  }
  if (operation !== "purchase" && operation !== "sell") {
    res.status(400).json({ result: "error", message: "incorrect operation" });
    return;
  }
  const parsedSum = parseFloat(sum, 10);
  if (!parsedSum) {
    res.status(400).json({ result: "error", message: "incorrect sum" });
    return;
  }
  const Shema = ShemaMap[symbol];
  getLatestRecord(Shema)
    .then(latestCandle => {
      const Exchange = new ExchangeContoller(user, latestCandle);
      return Exchange.exchage(symbol, operation, parsedSum);
    })
    .then(newWalletValue => {
      return User.findByIdAndUpdate(
        user.id,
        { wallet: newWalletValue },
        { new: true }
      );
    })
    .then(({ wallet }) => {
      const formattedWallet = wallet.toObject();
      res.json({ result: "changed", ...formattedWallet });
    })
    .catch(error => {
      if (error instanceof ValidationError) {
        res.status(400).json({ result: "error", message: error.message });
      } else {
        throw error;
      }
    })
    .catch(next);
};
