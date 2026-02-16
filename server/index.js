require("dotenv").config();

const eventsRoute = require("./routes/eventsRoute");
const authRoute = require("./routes/authRoute");
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoute");
const notificationRoutes = require("./routes/notifications");
const testRoute = require("./routes/testRoute");
const liveSportsRoutes = require("./routes/liveSports");
const express = require("express");
const cors = require("cors");
const chatRoutes = require("./routes/chat");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", testRoute);
app.use("/api/events", eventsRoute);
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/notifications", notificationRoutes);

app.use("/api/live-sports", liveSportsRoutes);
app.use("/api/chat", chatRoutes);
// Serve uploaded images
app.use("/uploads", express.static("uploads"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

 


app.get("/", (req, res) => {
  res.send("GullyPlay Server Running ⚡");
});

const PORT = 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
