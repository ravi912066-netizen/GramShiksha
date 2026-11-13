const express = require("express");
const authenticate = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/profile", authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Profile accessed successfully",
    user: req.user,
  });
});

module.exports = router;