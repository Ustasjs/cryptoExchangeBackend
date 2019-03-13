const express = require("express");
const stockController = require("../controllers/stock");
const authenticate = require("@helpers").authenticate;
const router = express.Router();

router.get("/exchange", authenticate, stockController.handleExchange);

module.exports = router;
