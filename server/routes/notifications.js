const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const verifyToken = require("../middleware/authMiddleware");

// GET all notifications
router.get("/", async (req, res) => {
  const notifications = await Notification.find().sort({ createdAt: -1 });
  res.json(notifications);
});

// ADMIN create notification
router.post("/", verifyToken, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message required" });
    }

    const newNotification = new Notification({ message });
    await newNotification.save();

    res.json(newNotification);

  } catch (error) {
    res.status(500).json({ message: "Error sending notification" });
  }
});
// DELETE notification (Admin only)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting notification" });
  }
});


module.exports = router;
