const express = require("express");
const router = express.Router();
const multer = require("multer");
const verifyToken = require("../middleware/authMiddleware");
const Chat = require("../models/Chat");

// Image storage
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// GET all chats
router.get("/", async (req, res) => {
  const chats = await Chat.find()
    .populate("userId", "name")
    .sort({ createdAt: 1 });

  res.json(chats);
});

// SEND message (text or image)
router.post("/", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const userId = req.user.userId;
    const role = req.user.role;

    // 2 min delay for photo uploads
    if (req.file) {
      const lastImage = await Chat.findOne({
        userId,
        image: { $exists: true }
      }).sort({ createdAt: -1 });

      if (lastImage) {
        const diff = (Date.now() - lastImage.createdAt.getTime()) / 60000;
        if (diff < 2) {
          return res.status(400).json({
            message: "Wait 2 minutes before uploading another photo"
          });
        }
      }
    }

    const newChat = new Chat({
      message: req.body.message,
      image: req.file ? req.file.filename : null,
      userId,
      role
    });

    await newChat.save();
    res.json(newChat);

  } catch (error) {
    res.status(500).json({ message: "Error sending message" });
  }
});

module.exports = router;
