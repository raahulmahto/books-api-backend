const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    version: 2,
    message: "Books API v2 is coming soon",
  });
});

module.exports = router;
