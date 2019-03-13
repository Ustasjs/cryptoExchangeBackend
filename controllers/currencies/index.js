const currenciesSymbols = require("@helpers").currenciesSymbols;
const mongoose = require("mongoose");
const CurrenciesController = require("./CurrenciesController");
const BtcSchema = mongoose.model(currenciesSymbols.BTC);
const EthSchema = mongoose.model(currenciesSymbols.ETH);

class LoadCurrenciesController {
  constructor(interval) {
    this.interval = interval;
    this.saveIntervalId = null;
    this.deleteIntervalId = null;
  }

  init() {
    this.loadCurrencies();
    process.on("SIGINT", function() {
      clearInterval(this.saveIntervalId);
      clearInterval(this.deleteIntervalId);
    });
  }

  loadCurrencies() {
    const BtcController = new CurrenciesController(BtcSchema);
    const EthController = new CurrenciesController(EthSchema);
    const controllersArray = [BtcController, EthController];

    this.saveIntervalId = setInterval(() => {
      controllersArray.forEach(controller => controller.getCurrencyData());
    }, this.interval);

    this.deleteIntervalId = setInterval(() => {
      controllersArray.forEach(controller => controller.clearExtraData());
    }, 20000);
  }
}

module.exports = LoadCurrenciesController;
