const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "GullyPlay API Working 🚀"
  });
});

module.exports = router;
