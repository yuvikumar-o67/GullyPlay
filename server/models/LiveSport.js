const mongoose = require("mongoose");

const liveSportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  field: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  reactions: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      status: {
        type: String,
        enum: ["coming", "not-coming"]
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400
  }
});

module.exports = mongoose.model("LiveSport", liveSportSchema);
