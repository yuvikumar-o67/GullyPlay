const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  message: {
    type: String
  },
  image: {
    type: String
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  role: {
    type: String,
    enum: ["admin", "user"]
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // auto delete after 24 hrs
  }
});

module.exports = mongoose.model("Chat", chatSchema);
