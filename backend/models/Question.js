const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },

  text: { type: String, required: true },

  options: [
    {
      id: Number,
      text: String
    }
  ],

  correctOptionId: Number,

  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "easy"
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Question", QuestionSchema);
