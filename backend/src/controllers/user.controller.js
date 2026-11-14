const prisma = require("../db");

const getUserProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile accessed successfully",
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getStudentDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Fetch student's enrollments with course details and lessons
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

    // Fetch all completed lessons for this user
    const completedProgress = await prisma.progress.findMany({
      where: {
        userId,
        completed: true,
      },
      select: {
        lessonId: true,
      },
    });

    const completedLessonIdSet = new Set(completedProgress.map((p) => p.lessonId));

    let totalLessonsAcrossCourses = 0;
    let totalCompletedLessons = 0;

    const enrolledCourses = enrollments.map((enrollment) => {
      const course = enrollment.course;
      const courseTotalLessons = course.lessons.length;
      const courseCompletedLessons = course.lessons.filter((lesson) =>
        completedLessonIdSet.has(lesson.id)
      ).length;

      totalLessonsAcrossCourses += courseTotalLessons;
      totalCompletedLessons += courseCompletedLessons;

      const courseProgressPercentage =
        courseTotalLessons > 0
          ? Math.round((courseCompletedLessons / courseTotalLessons) * 100)
          : 0;

      return {
        courseId: course.id,
        title: course.title,
        description: course.description,
        subject: course.subject,
        enrolledAt: enrollment.enrolledAt,
        instructor: course.createdBy ? course.createdBy.name : "Instructor",
        totalLessons: courseTotalLessons,
        completedLessons: courseCompletedLessons,
        pendingLessons: Math.max(0, courseTotalLessons - courseCompletedLessons),
        progressPercentage: courseProgressPercentage,
      };
    });

    const totalPendingLessons = Math.max(
      0,
      totalLessonsAcrossCourses - totalCompletedLessons
    );

    const overallProgressPercentage =
      totalLessonsAcrossCourses > 0
        ? Math.round(
            (totalCompletedLessons / totalLessonsAcrossCourses) * 100
          )
        : 0;

    return res.status(200).json({
      success: true,
      message: "Student dashboard retrieved successfully",
      dashboard: {
        user,
        summary: {
          totalEnrolledCourses: enrollments.length,
          totalLessons: totalLessonsAcrossCourses,
          completedLessons: totalCompletedLessons,
          pendingLessons: totalPendingLessons,
          overallProgressPercentage,
        },
        enrolledCourses,
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

module.exports = {
  getUserProfile,
  getStudentDashboard,
};