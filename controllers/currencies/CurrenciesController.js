const R = require("ramda");
const api = require("@api");
const helpers = require("@helpers");

/* eslint-disable no-console */
module.exports = class CurrenciesController {
  constructor(Shema) {
    this.isSaved = true;
    this.Shema = Shema;
  }

  getCurrencyData() {
    if (this.isSaved) {
      this.isSaved = false;
      helpers
        .getLatestRecord(this.Shema)
        .then(latestRecord => {
          const lastTime = latestRecord ? latestRecord.mts : 0;
          api
            .fetchData(this.Shema.getCurrency(), "USD", 2000)
            .then(data => this.saveData(data, lastTime));
        })
        .catch(e => console.log("error during fetching", e));
    }
  }

  formatData(data, lastTime) {
    const mapData = ({ high, low, time }) => {
      const average = (high + low) / 2;

      return {
        mts: time * 1000,
        high: high,
        low: low,
        sell: average,
        purchase: average - average * 0.01
      };
    };
    return R.compose(
      R.map(mapData),
      R.filter(element => {
        return element.time * 1000 > lastTime;
      })
    )(data);
  }

  saveData(responce, lastTime) {
    const resultData = responce.data.Data;
    if (!R.isEmpty(resultData)) {
      const formattedData = this.formatData(resultData, lastTime);
      this.Shema.create(formattedData)
        .then(() => {
          this.isSaved = true;
        })
        .catch(error => console.log("error during saving", error));
    }
  }

  clearExtraData() {
    const dataSavingPeriod = helpers.offsetUnitMilliseconds.d * 7;
    const offsetForSearch = Date.now() - dataSavingPeriod;
    this.Shema.deleteMany({ mts: { $lt: offsetForSearch } }).catch(error =>
      console.log("error during deleting", error)
    );
  }
};
