const axios = require("axios");

const baseURL = "https://min-api.cryptocompare.com/data/";

const instance = axios.create({
  baseURL,
  headers: {
    Accept: "*/*",
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: `Apikey ${process.env.CRYPTO_API_KEY}`
  }
});

module.exports.fetchData = (fsym, tsym, limit) =>
  instance.get(`/histominute`, { params: { fsym, tsym, limit } });
