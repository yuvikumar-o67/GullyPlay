const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const Event = require("../models/Event");

// GET all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find()
      .populate("reactions.userId", "name");

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events" });
  }
});


// POST new event
router.post("/", verifyToken, async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    const savedEvent = await newEvent.save();
    res.json(savedEvent);
  } catch (error) {
    res.status(500).json({ message: "Error creating event" });
  }
});


// DELETE event (Protected)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event" });
  }
});

// REACT TO EVENT
router.post("/:id/react", verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const userId = req.user.userId;

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const existingReaction = event.reactions.find(
      (r) => r.userId.toString() === userId
    );

    if (existingReaction) {
      existingReaction.status = status;
    } else {
      event.reactions.push({ userId, status });
    }

    await event.save();

    res.json({ message: "Reaction saved" });

  } catch (error) {
    res.status(500).json({ message: "Reaction failed" });
  }
});


module.exports = router;
