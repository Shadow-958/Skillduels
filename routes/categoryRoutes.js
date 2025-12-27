
const express = require("express");
const router = express.Router();
const { 
  createCategory, 
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} = require("../controllers/categoryController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const { validateCategory } = require("../middleware/validationMiddleware");

// Public routes (no auth needed)
router.get("/", getCategories);
router.get("/:id", getCategoryById);

// Admin routes (create, update, delete)
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  validateCategory,
  createCategory
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateCategory,
  updateCategory
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteCategory
);

module.exports = router;