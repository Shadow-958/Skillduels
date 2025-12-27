const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getMe, refreshToken, logoutUser } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshToken);
router.post("/logout", logoutUser);
router.get("/me", authMiddleware, getMe);

module.exports = router;
