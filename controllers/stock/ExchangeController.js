const { ValidationError } = require("@helpers");

module.exports = class ExchangeContoller {
  constructor(user, candle) {
    this.user = user.toObject();
    this.candle = candle;
  }

  exchage(symbol, operation, sum) {
    return this[operation](symbol, sum, this.user.wallet);
  }

  sell(symbol, sum, wallet) {
    const price = this.candle.purchase;
    const { [symbol]: currency, usd } = wallet;
    if (sum > currency) {
      throw new ValidationError(`Not enough ${symbol}`);
    }
    const newUsdValue = usd + sum * price;
    const newCurrencyValue = currency - sum;
    return {
      ...wallet,
      usd: newUsdValue,
      [symbol]: newCurrencyValue
    };
  }

  purchase(symbol, sum, wallet) {
    const price = this.candle.sell;
    const resultPrice = sum * price;
    const { usd, [symbol]: currency } = wallet;
    if (resultPrice > usd) {
      throw new ValidationError("Not enough usd");
    }
    const newUsdValue = usd - resultPrice;
    const newCurrencyValue = currency + sum;
    return {
      ...wallet,
      usd: newUsdValue,
      [symbol]: newCurrencyValue
    };
  }
};
