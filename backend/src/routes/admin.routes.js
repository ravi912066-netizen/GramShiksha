
const express = require("express");

const {
  getAdminStats,
  getAdminDashboard,
  getAdminUsers,
  getAdminCourses,
} = require("../controllers/admin.controller");
const authenticate = require("../middleware/auth.middleware");
const authorizeAdmin = require("../middleware/admin.middleware");

const router = express.Router();

// All admin routes require authentication and admin authorization
router.use(authenticate, authorizeAdmin);

router.get("/dashboard", getAdminDashboard);
router.get("/stats", getAdminStats);
router.get("/users", getAdminUsers);
router.get("/courses", getAdminCourses);

module.exports = router;
