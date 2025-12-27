const express = require("express");
const router = express.Router();
const { getGlobalLeaderboard, getWeeklyLeaderboard } = require("../controllers/leaderboardController");

router.get("/global", getGlobalLeaderboard);
router.get("/weekly", getWeeklyLeaderboard);

module.exports = router;
