const Match = require("../models/Match");
const Question = require("../models/Question");
const User = require("../models/User");
const mongoose = require("mongoose");

exports.startMatch = async (req, res) => {
    try {
        const { categoryId } = req.body;
        const userId = req.userId;

        // Fetch 5 random questions for the category
        const questions = await Question.aggregate([
            { $match: { category: new mongoose.Types.ObjectId(categoryId) } },
            { $sample: { size: 5 } },
        ]);

        const questionIds = questions.map((q) => q._id);

        const match = await Match.create({
            players: [{ user: userId, socketId: null }], // SocketId updated later via socket
            category: categoryId,
            questions: questionIds,
            state: "active", // Or 'waiting' if waiting for opponent
            startedAt: new Date(),
        });

        // Populate questions to return to frontend
        await match.populate("questions");

        res.status(201).json({ matchId: match._id, questions: match.questions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.submitScore = async (req, res) => {
    try {
        const { matchId, score } = req.body;
        const userId = req.userId;

        const match = await Match.findById(matchId);
        if (!match) return res.status(404).json({ error: "Match not found" });

        // Update score
        const playerIndex = match.players.findIndex((p) => p.user.toString() === userId);
        if (playerIndex !== -1) {
            // If we want to store score in 'scores' array or update player object?
            // Model has 'scores' array.
            match.scores.push({ userId, score });
        }

        // Check if all players finished (for now assume single player flow via API)
        // If multiplayer, this logic needs to be robust.

        // Update User XP
        const user = await User.findById(userId);
        if (user) {
            user.xp += score;
            user.weeklyXp += score;

            // Simple rank logic
            if (user.xp > 1000) user.rank = "Pro";
            if (user.xp > 5000) user.rank = "Master";

            // Badge Logic
            if (user.xp >= 100 && !user.badges.includes("Novice")) {
                user.badges.push("Novice");
            }
            if (user.xp >= 1000 && !user.badges.includes("Pro Gamer")) {
                user.badges.push("Pro Gamer");
            }
            if (score >= 50 && !user.badges.includes("Perfect Score")) {
                user.badges.push("Perfect Score");
            }

            await user.save();
        }

        await match.save();

        res.json({ message: "Score submitted", xp: user.xp, rank: user.rank });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
