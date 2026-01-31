const express = require("express");
const router = express.Router();
const {
  shortenUrl,
  redirectUrl,
} = require("../controllers/url.controller");

router.post("/shorten", shortenUrl);
router.get("/:shortCode", redirectUrl);

module.exports = router;
