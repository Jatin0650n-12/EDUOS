const express = require("express");
const router = express.Router();
const { extractTextFromResume } = require("../controllers/extractController");

router.get("/:id", extractTextFromResume);

module.exports = router;
