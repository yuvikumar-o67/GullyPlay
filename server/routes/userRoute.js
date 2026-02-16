const nodemailer = require("nodemailer");

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const verifyToken = require("../middleware/authMiddleware");

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

/* =================================================
   REGISTER
================================================= */
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: "user"
    });

    await newUser.save();

    res.json({ message: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ message: "Error registering user" });
  }
});


/* =================================================
   LOGIN
================================================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.isBanned) {
      return res.status(403).json({ message: "You are banned from GullyPlay" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      name: user.username,
      role: user.role
    });

  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
});


/* =================================================
   FORGOT PASSWORD (Generate Secure Reset Link)
================================================= */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Email not registered" });
    }

    const crypto = require("crypto");

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"GullyPlay" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "GullyPlay Password Reset",
      html: `
        <h3>Password Reset Request</h3>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link expires in 15 minutes.</p>
      `
    });

    res.json({ message: "Password reset link sent to your email" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error generating reset link" });
  }
});


/* =================================================
   RESET PASSWORD
================================================= */
router.post("/reset-password/:token", async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired link" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (error) {
    res.status(500).json({ message: "Error resetting password" });
  }
});


/* =================================================
   GET ALL USERS (Admin Only)
================================================= */
router.get("/", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const users = await User.find()
      .select("username email role isBanned createdAt");

    res.json(users);

  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});


/* =================================================
   REMOVE USER (Admin Only)
================================================= */
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User removed successfully" });

  } catch (error) {
    res.status(500).json({ message: "Error removing user" });
  }
});


/* =================================================
   BAN USER (Admin Only)
================================================= */
router.put("/ban/:id", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    await User.findByIdAndUpdate(req.params.id, { isBanned: true });

    res.json({ message: "User banned successfully" });

  } catch (error) {
    res.status(500).json({ message: "Error banning user" });
  }
});


module.exports = router;
