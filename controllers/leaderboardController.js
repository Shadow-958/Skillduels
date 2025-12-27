
const User = require("../models/User");

// Get global leaderboard (top 10 all-time)
exports.getGlobalLeaderboard = async (req, res, next) => {
  try {
    const leaderboard = await User.find({ isActive: true })
      .sort({ xp: -1 })
      .limit(10)
      .select("username xp rank badges createdAt");

    res.json({
      success: true,
      type: "global",
      count: leaderboard.length,
      data: leaderboard,
    });
  } catch (error) {
    next(error);
  }
};

// Get weekly leaderboard (top 10 this week)
exports.getWeeklyLeaderboard = async (req, res, next) => {
  try {
    const leaderboard = await User.find({ isActive: true })
      .sort({ weeklyXp: -1 })
      .limit(10)
      .select("username weeklyXp xp rank badges");

    res.json({
      success: true,
      type: "weekly",
      count: leaderboard.length,
      data: leaderboard,
    });
  } catch (error) {
    next(error);
  }
};

// Get user's rank (protected)
exports.getUserRank = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select(
      "username xp weeklyXp rank badges"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get global rank
    const globalRank = await User.countDocuments({
      xp: { $gt: user.xp },
      isActive: true,
    });

    // Get weekly rank
    const weeklyRank = await User.countDocuments({
      weeklyXp: { $gt: user.weeklyXp },
      isActive: true,
    });

    res.json({
      success: true,
      data: {
        user,
        globalRank: globalRank + 1,
        weeklyRank: weeklyRank + 1,
      },
    });
  } catch (error) {
    next(error);
  }
};