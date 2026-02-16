const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: String,
  location: String,
  time: String,
  reactions: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      status: {
        type: String,
        enum: ["coming", "not_coming"]
      }
    }
  ]
});

module.exports = mongoose.model("Event", eventSchema);
