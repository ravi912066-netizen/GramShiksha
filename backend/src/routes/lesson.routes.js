const express = require("express");

const {
  getLessonById,
  updateLesson,
  deleteLesson,
} = require("../controllers/lesson.controller");
const {
  updateLessonProgress,
  getLessonProgress,
} = require("../controllers/progress.controller");
const authenticate = require("../middleware/auth.middleware");
const authorizeAdmin = require("../middleware/admin.middleware");
const validate = require("../middleware/validate.middleware");
const { progressSchema } = require("../validators/schemas");

const router = express.Router();

// Protected route to view full lesson content (requires authentication + enrollment verification)
router.get("/:id", authenticate, getLessonById);
router.get("/:id/access", authenticate, getLessonById);

// Student lesson progress tracking
router.post(
  "/:lessonId/progress",
  authenticate,
  validate(progressSchema),
  updateLessonProgress
);
router.get("/:lessonId/progress", authenticate, getLessonProgress);

// Admin-only routes for lesson management
router.put("/:id", authenticate, authorizeAdmin, updateLesson);
router.patch("/:id", authenticate, authorizeAdmin, updateLesson);
router.delete("/:id", authenticate, authorizeAdmin, deleteLesson);

module.exports = router;