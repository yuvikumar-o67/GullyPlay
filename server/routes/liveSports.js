const express = require("express");
const router = express.Router();
const multer = require("multer");
const verifyToken = require("../middleware/authMiddleware");
const LiveSport = require("../models/LiveSport");

// Image storage setup
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// GET all live sports
router.get("/", async (req, res) => {
  const sports = await LiveSport.find().populate("userId", "name");
  res.json(sports);
});

// POST live sport (with anti-spam)
router.post("/", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { title, location, field } = req.body;
    const userId = req.user.userId;

    // Anti-spam: 1 post per 10 mins
    const lastPost = await LiveSport.findOne({ userId }).sort({ createdAt: -1 });

    if (lastPost) {
      const diff = (Date.now() - lastPost.createdAt.getTime()) / 60000;
      if (diff < 10) {
        return res.status(400).json({ message: "Wait 10 minutes before posting again" });
      }
    }

    const newLive = new LiveSport({
      title,
      location,
      field,
      image: req.file.filename,
      userId
    });
    
    await newLive.save();
    res.json(newLive);

  } catch (error) {
    res.status(500).json({ message: "Error creating live sport" });
  }
});
// React to live sport
router.post("/:id/react", verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const userId = req.user.userId;

    const sport = await LiveSport.findById(req.params.id);

    if (!sport) {
      return res.status(404).json({ message: "Not found" });
    }

    const existing = sport.reactions.find(
      (r) => r.userId.toString() === userId
    );

    if (existing) {
      existing.status = status;
    } else {
      sport.reactions.push({ userId, status });
    }

    await sport.save();
    res.json({ message: "Reaction saved" });

  } catch (error) {
    res.status(500).json({ message: "Reaction failed" });
  }
});


module.exports = router;
