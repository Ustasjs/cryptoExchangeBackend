const express = require("express");
const usersController = require("../controllers/users");
const router = express.Router();
const passport = require("passport");

const authenticate = passport.authenticate("jwt", {
  session: false
});

router.post("/", usersController.registration);

router.get("/me", authenticate, usersController.getEmail);

router.get("/wallet", authenticate, usersController.getWallet);

module.exports = router;
