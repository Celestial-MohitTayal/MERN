const express = require("express");
const { handleGenerateShortURL } = require("../controllers/url");
const router = express.Router();

router.post("/url", handleGenerateShortURL);

module.exports = router;
