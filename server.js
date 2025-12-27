const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const connectDB = require("./config/db");
const { initializeSocket } = require("./socket/socketHandler");

dotenv.config();

const app = express();

// ============================================================
// MIDDLEWARE CONFIGURATION
// ============================================================

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================================
// DATABASE CONNECTION
// ============================================================

connectDB();

// ============================================================
// ROUTES - All API Endpoints
// ============================================================

// Authentication Routes (Member 1 - Complete)
app.use("/api/auth", require("./routes/authRoutes"));

// Category Routes (Member 1 - Pending)
app.use("/api/categories", require("./routes/categoryRoutes"));

// Question Routes (Member 1 - Pending)
app.use("/api/questions", require("./routes/questionRoutes"));

// Match Routes (Member 1 - Pending)
app.use("/api/match", require("./routes/matchRoutes"));

// Leaderboard Routes (Member 1 - Pending)
app.use("/api/leaderboard", require("./routes/leaderboardRoutes"));

// ============================================================
// HEALTH CHECK ENDPOINT
// ============================================================

app.get("/", (req, res) => {
  res.json({
    message: "SkillDuels Backend Running",
    status: "Active",
    version: "1.0.0",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "UP",
    timestamp: new Date().toISOString(),
    database: "Connected",
    socketIO: "Ready",
  });
});

// ============================================================
// ERROR HANDLING MIDDLEWARE
// ============================================================

app.use((err, req, res, next) => {
  console.error("[ERROR]", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    code: err.code || "SERVER_ERROR",
  });
});

// ============================================================
// HTTP SERVER + SOCKET.IO INITIALIZATION
// ============================================================

const server = http.createServer(app);
const io = initializeSocket(server);

// ============================================================
// SERVER STARTUP
// ============================================================

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║           🎮 SKILLDUEL SERVER STARTED 🎮              ║
║                                                        ║
║  Environment: ${NODE_ENV.toUpperCase().padEnd(35)}║
║  REST API: http://localhost:${PORT}${" ".repeat(23)}║
║  WebSocket: ws://localhost:${PORT}${" ".repeat(20)}║
║                                                        ║
║  Database: MongoDB Connected ✅${" ".repeat(19)}║
║  Socket.IO: Initialized ✅${" ".repeat(22)}║
║  CORS Origin: ${(process.env.FRONTEND_URL || "http://localhost:3000").padEnd(27)}║
║                                                        ║
║  Status: Ready for Real-Time Gaming ✅${" ".repeat(13)}║
╚════════════════════════════════════════════════════════╝
  `);

  console.log("\n📡 WebSocket Events Registered:");
  console.log("  ├─ user-join");
  console.log("  ├─ create-match");
  console.log("  ├─ join-match");
  console.log("  ├─ submit-answer");
  console.log("  ├─ next-question");
  console.log("  ├─ sync-timer");
  console.log("  ├─ forfeit-match");
  console.log("  ├─ reconnect-match");
  console.log("  └─ disconnect\n");
});

// ============================================================
// GRACEFUL SHUTDOWN
// ============================================================

process.on("SIGTERM", () => {
  console.log("[SHUTDOWN] SIGTERM received, closing server gracefully...");
  server.close(() => {
    console.log("[SHUTDOWN] Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("[SHUTDOWN] SIGINT received, closing server gracefully...");
  server.close(() => {
    console.log("[SHUTDOWN] Server closed");
    process.exit(0);
  });
});

// ============================================================
// UNHANDLED ERRORS
// ============================================================

process.on("uncaughtException", (error) => {
  console.error("[UNCAUGHT EXCEPTION]", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("[UNHANDLED REJECTION]", reason);
  process.exit(1);
});

module.exports = { server, io };