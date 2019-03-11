const express = require("express");
const usersController = require("../controllers/users");
const authenticate = require("@helpers").authenticate;
const router = express.Router();

router.post("/", usersController.registration);

router.get("/me", authenticate, usersController.getEmail);

router.get("/wallet", authenticate, usersController.getWallet);

module.exports = router;
