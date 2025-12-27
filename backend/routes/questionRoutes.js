const express = require("express");
const router = express.Router();
const { createQuestion, getQuestionsByCategory } = require("../controllers/questionController");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

router.post("/", auth, admin, createQuestion);
router.get("/:categoryId", getQuestionsByCategory);

module.exports = router;
