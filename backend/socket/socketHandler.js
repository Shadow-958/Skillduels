const Match = require("../models/Match");

module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log("New client connected:", socket.id);

        // Join a match room
        socket.on("join_match", async ({ matchId, userId }) => {
            socket.join(matchId);
            console.log(`User ${userId} joined match ${matchId}`);

            // Update match state if needed (e.g. mark player as connected)
            // For now, just notify others
            socket.to(matchId).emit("player_joined", { userId });
        });

        // Submit answer (Real-time update)
        socket.on("submit_answer", ({ matchId, userId, questionId, isCorrect }) => {
            // Broadcast score update to opponent
            io.to(matchId).emit("score_update", { userId, isCorrect });
        });

        // Game Over / Leave
        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    });
};
