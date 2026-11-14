
const express = require("express");

const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require("../controllers/course.controller");
const {
  createLesson,
  getLessonsByCourse,
  getProtectedCourseLessons,
} = require("../controllers/lesson.controller");
const {
  enrollInCourse,
  getEnrollmentStatus,
} = require("../controllers/enrollment.controller");
const authenticate = require("../middleware/auth.middleware");
const authorizeAdmin = require("../middleware/admin.middleware");
const validate = require("../middleware/validate.middleware");
const {
  courseCreateSchema,
  courseUpdateSchema,
  lessonCreateSchema,
} = require("../validators/schemas");

const router = express.Router();

// Public routes for browsing courses
router.get("/", getAllCourses);
router.get("/:id", getCourseById);

// Admin-only routes for course management
router.post(
  "/",
  authenticate,
  authorizeAdmin,
  validate(courseCreateSchema),
  createCourse
);
router.put(
  "/:id",
  authenticate,
  authorizeAdmin,
  validate(courseUpdateSchema),
  updateCourse
);
router.patch(
  "/:id",
  authenticate,
  authorizeAdmin,
  validate(courseUpdateSchema),
  updateCourse
);
router.delete("/:id", authenticate, authorizeAdmin, deleteCourse);

// Course lessons management
router.post(
  "/:courseId/lessons",
  authenticate,
  authorizeAdmin,
  validate(lessonCreateSchema),
  createLesson
);
router.get("/:courseId/lessons", getLessonsByCourse);
router.get("/:courseId/lessons/access", authenticate, getProtectedCourseLessons);

// Student course enrollment
router.post("/:courseId/enroll", authenticate, enrollInCourse);
router.get("/:courseId/enrollment-status", authenticate, getEnrollmentStatus);

module.exports = router;
