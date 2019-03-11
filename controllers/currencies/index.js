const currenciesSymbols = require("@helpers").currenciesSymbols;
const mongoose = require("mongoose");
const CurrenciesController = require("./CurrenciesController");
const BtcSchema = mongoose.model(currenciesSymbols.BTC);
const EthSchema = mongoose.model(currenciesSymbols.ETH);

class LoadCurrenciesController {
  constructor(interval) {
    this.interval = interval;
    this.intervalId = null;
  }

  init() {
    this.loadCurrencies();
    process.on("SIGINT", function() {
      clearInterval(this.intervalId);
    });
  }

  loadCurrencies() {
    const BtcController = new CurrenciesController(BtcSchema);
    const EthController = new CurrenciesController(EthSchema);
    const controllersArray = [BtcController, EthController];

    this.interval = setInterval(() => {
      controllersArray.forEach(controller => controller.getCurrencyData());
    }, this.interval);
  }
}

module.exports = LoadCurrenciesController;
