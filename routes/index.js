const express = require("express");
const path = require("path");
const router = express.Router();

/* GET home page. */
router.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../public", "index.html"));
});

router.get("/trade/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../public", "index.html"));
});

module.exports = router;
