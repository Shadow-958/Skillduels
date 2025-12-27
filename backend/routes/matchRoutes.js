const express = require("express");
const router = express.Router();
const { startMatch, submitScore } = require("../controllers/matchController");
const auth = require("../middleware/authMiddleware");

// Protected routes
router.post("/start", auth, startMatch);
router.post("/submit", auth, submitScore);

module.exports = router;
