const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const admin = require("../adminData");

const SECRET_KEY = "supersecretkey";

// Login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (username !== admin.username) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
  { role: "admin" },
  SECRET_KEY,
  { expiresIn: "1d" }
);

  res.json({ token });
});

module.exports = router;
