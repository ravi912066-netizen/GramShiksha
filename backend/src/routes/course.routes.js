
const express = require("express");

const {
  createCourse,
  getAllCourses,
  getCourseById,
} = require("../controllers/course.controller");
const authenticate = require("../middleware/auth.middleware");
const authorizeAdmin = require("../middleware/admin.middleware");

const router = express.Router();

// Public routes for browsing courses
router.get("/", getAllCourses);
router.get("/:id", getCourseById);

// Admin-only route for creating courses
router.post("/", authenticate, authorizeAdmin, createCourse);

module.exports = router;
