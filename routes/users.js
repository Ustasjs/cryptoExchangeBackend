const express = require("express");
const usersController = require("../controllers/users");
const router = express.Router();

router.post("/", usersController.registration);

module.exports = router;
