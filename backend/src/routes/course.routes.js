
const express = require("express");

const { createCourse } = require("../controllers/course.controller");
const authenticate = require("../middleware/auth.middleware");
const authorizeAdmin = require("../middleware/admin.middleware");

const router = express.Router();

router.post("/", authenticate, authorizeAdmin, createCourse);

module.exports = router;
