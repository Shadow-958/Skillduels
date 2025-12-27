const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Connect MongoDB
// Connect MongoDB
connectDB();

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/questions", require("./routes/questionRoutes"));
app.use("/api/match", require("./routes/matchRoutes"));
app.use("/api/leaderboard", require("./routes/leaderboardRoutes"));

// Sample route for testing
app.get("/", (req, res) => {
  res.send("SkillDuels Backend Running...");
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Socket.io Setup
const io = require("socket.io")(server, {
  cors: {
    origin: "*", // Allow all origins for now
    methods: ["GET", "POST"]
  }
});

require("./socket/socketHandler")(io);
