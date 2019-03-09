var express = require("express");
var router = express.Router();
const usersTokenController = require("../controllers/userToken");

router.post("/", usersTokenController.getToken);

module.exports = router;
