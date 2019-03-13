const currenciesSymbols = require("@helpers").currenciesSymbols;
const mongoose = require("mongoose");
const R = require("ramda");

const offsetUnitMilliSeconds = {
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000
};

const step = 100;

const separate = R.curry(function(n, list) {
  const len = list.length;
  const f = (_v, idx) => Math.floor((idx * n) / len);
  return R.values(R.addIndex(R.groupBy)(f, list));
});

const formatCandlesData = data =>
  R.compose(
    R.map(element =>
      R.reduce((a, b) => R.mergeLeft(a, b.toObject()), {}, element)
    ),
    separate(100)
  )(data);

module.exports.getCandles = (req, res, next) => {
  const { symbol, offset } = req.query;
  if (!symbol || !currenciesSymbols[symbol.toUpperCase()]) {
    res.status(400).json({ result: "error", message: "incorrect symbol" });
    return;
  }
  if (!offset || !/^[0-9][hd]$/i.exec(offset)) {
    res.status(400).json({ result: "error", message: "incorrect offset" });
    return;
  }
  const [offsetValue, offsetUnit] = offset.split("");
  const millisecondsOffset = offsetUnitMilliSeconds[offsetUnit] * offsetValue;
  const resultOffsetForSearch = Date.now() - millisecondsOffset;
  const CurrencyModel = mongoose.model(symbol.toUpperCase());
  CurrencyModel.find({ mts: { $gte: resultOffsetForSearch } })
    .then(data => {
      const dataLength = data.length;
      const result = dataLength > step ? formatCandlesData(data) : data;
      if (result > step) {
        R.compose()(result);
      }
      res.json({ result });
      return;
    })
    .catch(next);
};
