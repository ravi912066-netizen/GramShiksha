
const express = require("express");

const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require("../controllers/course.controller");
const authenticate = require("../middleware/auth.middleware");
const authorizeAdmin = require("../middleware/admin.middleware");

const router = express.Router();

// Public routes for browsing courses
router.get("/", getAllCourses);
router.get("/:id", getCourseById);

// Admin-only routes for course management
router.post("/", authenticate, authorizeAdmin, createCourse);
router.put("/:id", authenticate, authorizeAdmin, updateCourse);
router.patch("/:id", authenticate, authorizeAdmin, updateCourse);
router.delete("/:id", authenticate, authorizeAdmin, deleteCourse);

module.exports = router;
