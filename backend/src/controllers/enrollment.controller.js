const prisma = require("../db");

const enrollInCourse = async (req, res) => {
  try {
    const userId = req.user.userId;
    const courseId = parseInt(req.params.courseId, 10);

    if (isNaN(courseId) || courseId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID. ID must be a positive integer.",
      });
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if the user is already enrolled using the unique [userId, courseId] constraint
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      return res.status(409).json({
        success: false,
        message: "You are already enrolled in this course",
      });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            subject: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Successfully enrolled in the course",
      enrollment,
    });
  } catch (error) {
    console.error(error);

    // Handle potential Prisma unique constraint race conditions safely
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "You are already enrolled in this course",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getUserEnrollments = async (req, res) => {
  try {
    const userId = req.user.userId;

    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      orderBy: { enrolledAt: "desc" },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            subject: true,
            createdAt: true,
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            _count: {
              select: {
                lessons: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Enrolled courses retrieved successfully",
      count: enrollments.length,
      enrollments,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getEnrollmentStatus = async (req, res) => {
  try {
    const userId = req.user.userId;
    const courseId = parseInt(req.params.courseId, 10);

    if (isNaN(courseId) || courseId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID. ID must be a positive integer.",
      });
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    return res.status(200).json({
      success: true,
      courseId,
      isEnrolled: !!enrollment,
      enrollment: enrollment || null,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  enrollInCourse,
  getUserEnrollments,
  getEnrollmentStatus,
};