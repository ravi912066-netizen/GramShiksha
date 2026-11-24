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

const getRecommendations = async (req, res) => {
  try {
    const userId = req.user.userId;

    // 1. Get student's enrollments with courses and lessons
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            subject: true,
            lessons: {
              select: {
                id: true,
                title: true,
              },
              orderBy: { id: "asc" },
            },
          },
        },
      },
    });

    // 2. Get student's completed lesson progress
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

    // 3. Build enrolled course IDs and preferred subjects
    const enrolledCourseIds = new Set(enrollments.map((e) => e.course.id));
    const preferredSubjects = new Set(
      enrollments.map((e) => e.course.subject).filter(Boolean)
    );

    // 4. Find incomplete lessons from enrolled courses (CONTINUE_LESSON recommendations)
    const continueLessonRecommendations = [];

    for (const enrollment of enrollments) {
      const course = enrollment.course;
      for (const lesson of course.lessons) {
        if (!completedLessonIdSet.has(lesson.id)) {
          // Calculate course progress for this recommendation
          const courseTotalLessons = course.lessons.length;
          const courseCompletedLessons = course.lessons.filter((l) =>
            completedLessonIdSet.has(l.id)
          ).length;
          const courseProgressPercentage =
            courseTotalLessons > 0
              ? Math.round((courseCompletedLessons / courseTotalLessons) * 100)
              : 0;

          continueLessonRecommendations.push({
            type: "CONTINUE_LESSON",
            courseId: course.id,
            courseTitle: course.title,
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            subject: course.subject,
            progress: courseProgressPercentage,
            reason: "Continue your course",
          });
          break; // Only recommend the first incomplete lesson per course
        }
      }
    }

    // 5. If we already have 5+ recommendations from continue lessons, return them
    if (continueLessonRecommendations.length >= 5) {
      return res.status(200).json({
        success: true,
        message: "Personalized recommendations retrieved successfully",
        data: {
          recommendations: continueLessonRecommendations.slice(0, 5),
        },
      });
    }

    // 6. Find courses from preferred subjects that student hasn't enrolled in
    const subjectBasedCourses = await prisma.course.findMany({
      where: {
        id: { notIn: Array.from(enrolledCourseIds) },
        subject: { in: Array.from(preferredSubjects) },
      },
      select: {
        id: true,
        title: true,
        subject: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 5 - continueLessonRecommendations.length,
    });

    const subjectBasedRecommendations = subjectBasedCourses.map((course) => ({
      type: "COURSE",
      courseId: course.id,
      courseTitle: course.title,
      subject: course.subject,
      progress: 0,
      reason: "Based on your enrolled subject",
    }));

    // 7. If still not enough recommendations, fill with newest available courses
    const allRecommendationsSoFar = [
      ...continueLessonRecommendations,
      ...subjectBasedRecommendations,
    ];

    if (allRecommendationsSoFar.length < 5) {
      const recommendedCourseIds = new Set([
        ...enrolledCourseIds,
        ...subjectBasedCourses.map((c) => c.id),
      ]);

      const recentCourses = await prisma.course.findMany({
        where: {
          id: { notIn: Array.from(recommendedCourseIds) },
        },
        select: {
          id: true,
          title: true,
          subject: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 5 - allRecommendationsSoFar.length,
      });

      const recentRecommendations = recentCourses.map((course) => ({
        type: "COURSE",
        courseId: course.id,
        courseTitle: course.title,
        subject: course.subject,
        progress: 0,
        reason: "Recently added course",
      }));

      allRecommendationsSoFar.push(...recentRecommendations);
    }

    return res.status(200).json({
      success: true,
      message: "Personalized recommendations retrieved successfully",
      data: {
        recommendations: allRecommendationsSoFar.slice(0, 5),
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
  getRecommendations,
};