const prisma = require("../db");

const updateLessonProgress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userRole = req.user.role;
    const lessonId = parseInt(req.params.lessonId, 10);

    if (isNaN(lessonId) || lessonId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid lesson ID. ID must be a positive integer.",
      });
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            subject: true,
          },
        },
      },
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    // Verify enrollment for students
    if (userRole !== "ADMIN") {
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId: lesson.courseId,
          },
        },
      });

      if (!enrollment) {
        return res.status(403).json({
          success: false,
          message: "Access denied. You must be enrolled in this course to update progress.",
        });
      }
    }

    const { completed } = req.body;
    const isCompleted = completed !== undefined ? Boolean(completed) : true;

    // Use Prisma's composite unique constraint [userId, lessonId] to upsert progress
    const progress = await prisma.progress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {
        completed: isCompleted,
      },
      create: {
        userId,
        lessonId,
        completed: isCompleted,
      },
    });

    // Compute updated course-level progress
    const [totalCourseLessons, completedCourseLessons] = await Promise.all([
      prisma.lesson.count({
        where: { courseId: lesson.courseId },
      }),
      prisma.progress.count({
        where: {
          userId,
          completed: true,
          lesson: { courseId: lesson.courseId },
        },
      }),
    ]);

    const completionPercentage =
      totalCourseLessons > 0
        ? Math.round((completedCourseLessons / totalCourseLessons) * 100)
        : 0;

    return res.status(200).json({
      success: true,
      message: isCompleted
        ? "Lesson marked as completed"
        : "Lesson marked as incomplete",
      progress,
      courseProgress: {
        courseId: lesson.courseId,
        courseTitle: lesson.course.title,
        totalLessons: totalCourseLessons,
        completedLessons: completedCourseLessons,
        completionPercentage,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getLessonProgress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const lessonId = parseInt(req.params.lessonId, 10);

    if (isNaN(lessonId) || lessonId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid lesson ID. ID must be a positive integer.",
      });
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    const progress = await prisma.progress.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
    });

    return res.status(200).json({
      success: true,
      lessonId,
      completed: progress ? progress.completed : false,
      progress: progress || null,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getUserOverallProgress = async (req, res) => {
  try {
    const userId = req.user.userId;

    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            lessons: {
              select: {
                id: true,
                title: true,
                type: true,
              },
              orderBy: { id: "asc" },
            },
          },
        },
      },
    });

    const completedRecords = await prisma.progress.findMany({
      where: {
        userId,
        completed: true,
      },
      select: {
        lessonId: true,
      },
    });

    const completedSet = new Set(completedRecords.map((r) => r.lessonId));

    let totalEnrolledLessons = 0;
    let totalCompletedLessons = 0;

    const courseProgressList = enrollments.map((e) => {
      const course = e.course;
      const totalLessons = course.lessons.length;
      const completedInCourse = course.lessons.filter((l) =>
        completedSet.has(l.id)
      ).length;

      totalEnrolledLessons += totalLessons;
      totalCompletedLessons += completedInCourse;

      const percentage =
        totalLessons > 0
          ? Math.round((completedInCourse / totalLessons) * 100)
          : 0;

      return {
        courseId: course.id,
        courseTitle: course.title,
        subject: course.subject,
        totalLessons,
        completedLessons: completedInCourse,
        completionPercentage: percentage,
        isFullyCompleted: totalLessons > 0 && completedInCourse === totalLessons,
        lessons: course.lessons.map((l) => ({
          id: l.id,
          title: l.title,
          type: l.type,
          completed: completedSet.has(l.id),
        })),
      };
    });

    const overallPercentage =
      totalEnrolledLessons > 0
        ? Math.round((totalCompletedLessons / totalEnrolledLessons) * 100)
        : 0;

    return res.status(200).json({
      success: true,
      message: "User learning progress retrieved successfully",
      summary: {
        totalCourses: enrollments.length,
        totalLessons: totalEnrolledLessons,
        completedLessons: totalCompletedLessons,
        overallPercentage,
      },
      courses: courseProgressList,
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
  updateLessonProgress,
  getLessonProgress,
  getUserOverallProgress,
};