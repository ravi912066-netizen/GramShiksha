const express = require("express");
const authenticate = require("../middleware/auth.middleware");
const { getUserEnrollments } = require("../controllers/enrollment.controller");

const router = express.Router();

router.get("/profile", authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Profile accessed successfully",
    user: req.user,
  });
});

// Student enrollments list
router.get("/enrollments", authenticate, getUserEnrollments);

module.exports = router;