const User = require("../models/User");

exports.getGlobalLeaderboard = async (req, res) => {
    try {
        // Fetch top 10 users sorted by XP descending
        const leaderboard = await User.find()
            .sort({ xp: -1 })
            .limit(10)
            .select("username xp rank badges"); // Select only necessary fields

        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getWeeklyLeaderboard = async (req, res) => {
    try {
        // Fetch top 10 users sorted by weeklyXp descending
        const leaderboard = await User.find()
            .sort({ weeklyXp: -1 })
            .limit(10)
            .select("username weeklyXp rank badges");

        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
