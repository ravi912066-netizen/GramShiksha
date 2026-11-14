const express = require("express");
const authenticate = require("../middleware/auth.middleware");
const { getUserEnrollments } = require("../controllers/enrollment.controller");
const {
  getUserProfile,
  getStudentDashboard,
} = require("../controllers/user.controller");
const { getUserOverallProgress } = require("../controllers/progress.controller");

const router = express.Router();

// Profile
router.get("/profile", authenticate, getUserProfile);

// Student dashboard
router.get("/dashboard", authenticate, getStudentDashboard);

// Student enrollments list
router.get("/enrollments", authenticate, getUserEnrollments);

// Student overall learning progress
router.get("/progress", authenticate, getUserOverallProgress);

module.exports = router;