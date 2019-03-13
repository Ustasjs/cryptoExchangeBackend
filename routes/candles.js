const express = require("express");
const candlesController = require("../controllers/candles");
const authenticate = require("@helpers").authenticate;
const router = express.Router();

router.get("/", authenticate, candlesController.getCandles);

module.exports = router;
