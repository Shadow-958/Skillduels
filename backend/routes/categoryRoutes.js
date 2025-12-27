const express = require("express");
const router = express.Router();
const { createCategory, getCategories } = require("../controllers/categoryController");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

router.post("/", auth, admin, createCategory);
router.get("/", getCategories);

module.exports = router;
