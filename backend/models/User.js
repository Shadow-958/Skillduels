const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },

  xp: { type: Number, default: 0 },
  weeklyXp: { type: Number, default: 0 },
  rank: { type: String, default: "Rookie" },
  badges: [{ type: String }],

  isAdmin: { type: Boolean, default: false },
  refreshToken: { type: String },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);
