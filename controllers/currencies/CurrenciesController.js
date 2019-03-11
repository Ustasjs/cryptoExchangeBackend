const api = require("@api");
const R = require("ramda");

module.exports = class CurrenciesController {
  constructor(Shema) {
    this.isSaved = true;
    this.Shema = Shema;
  }

  getLatestRecord() {
    return this.Shema.findOne()
      .sort({ mts: -1 })
      .limit(1);
  }

  getCurrencyData() {
    if (this.isSaved) {
      this.isSaved = false;
      this.getLatestRecord()
        .then(latestRecord => {
          const lastTime = latestRecord ? latestRecord.mts : 0;
          api
            .fetchData(this.Shema.getCurrency(), "USD", 2000)
            .then(data => this.saveData(data, lastTime));
        })
        .catch(e => console.log("error", e));
    }
  }

  formatData(data, lastTime) {
    const mapData = ({ high, low, time }) => {
      const average = (high + low) / 2;

      return {
        mts: time,
        high: high,
        low: low,
        sell: average,
        purchase: average - average * 0.01
      };
    };
    return R.compose(
      R.map(mapData),
      R.filter(element => {
        return element.time > lastTime;
      })
    )(data);
  }

  saveData(responce, lastTime) {
    const resultData = responce.data.Data;
    if (!R.isEmpty(resultData)) {
      const formattedData = this.formatData(resultData, lastTime);
      console.log("formattedData", formattedData.length);
      this.Shema.create(formattedData)
        .then(() => {
          this.isSaved = true;
        })
        .catch(error => console.log("error", error));
    }
  }
};
