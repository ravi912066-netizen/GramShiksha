const express = require("express");

const {
  getLessonById,
  updateLesson,
  deleteLesson,
} = require("../controllers/lesson.controller");
const authenticate = require("../middleware/auth.middleware");
const authorizeAdmin = require("../middleware/admin.middleware");

const router = express.Router();

// Public route to view a lesson by ID
router.get("/:id", getLessonById);

// Admin-only routes for lesson management
router.put("/:id", authenticate, authorizeAdmin, updateLesson);
router.patch("/:id", authenticate, authorizeAdmin, updateLesson);
router.delete("/:id", authenticate, authorizeAdmin, deleteLesson);

module.exports = router;