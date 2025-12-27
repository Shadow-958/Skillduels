const mongoose = require("mongoose");

const MatchSchema = new mongoose.Schema({
  players: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      socketId: String
    }
  ],

  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },

  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],

  scores: [
    {
      userId: mongoose.Schema.Types.ObjectId,
      score: Number
    }
  ],

  state: {
    type: String,
    enum: ["waiting", "active", "finished"],
    default: "waiting"
  },

  startedAt: Date,
  finishedAt: Date
});

module.exports = mongoose.model("Match", MatchSchema);
