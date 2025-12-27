
const express = require("express");
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getMe, 
  refreshToken, 
  logoutUser 
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");
const { 
  validateEmail, 
  validateUsername, 
  validatePassword 
} = require("../middleware/validationMiddleware");

// Public routes (with validation)
router.post(
  "/register",
  validateEmail,
  validateUsername,
  validatePassword,
  registerUser
);

router.post(
  "/login",
  validateEmail,
  validatePassword,
  loginUser
);

// Protected routes
router.get("/me", authMiddleware, getMe);

router.post("/refresh", refreshToken);

router.post("/logout", authMiddleware, logoutUser);

module.exports = router;