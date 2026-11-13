
const express = require("express");

const authenticate = require("../middleware/auth.middleware");
const authorizeAdmin = require("../middleware/admin.middleware");

const router = express.Router();

router.get("/dashboard", authenticate, authorizeAdmin, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Admin Dashboard",
    admin: req.user,
  });
});

module.exports = router;
