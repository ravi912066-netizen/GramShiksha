const prisma = require("../db");

const getAdminStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalAdmins,
      totalCourses,
      totalLessons,
      totalEnrollments,
      totalProgressEntries,
      completedLessonsCount,
      lessonsByType,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.course.count(),
      prisma.lesson.count(),
      prisma.enrollment.count(),
      prisma.progress.count(),
      prisma.progress.count({ where: { completed: true } }),
      prisma.lesson.groupBy({
        by: ["type"],
        _count: { id: true },
      }),
    ]);

    const lessonTypeCounts = {
      VIDEO: 0,
      PDF: 0,
      NOTE: 0,
    };

    lessonsByType.forEach((group) => {
      lessonTypeCounts[group.type] = group._count.id;
    });

    return res.status(200).json({
      success: true,
      message: "Admin statistics retrieved successfully",
      stats: {
        users: {
          total: totalUsers,
          students: totalStudents,
          admins: totalAdmins,
        },
        courses: {
          total: totalCourses,
        },
        lessons: {
          total: totalLessons,
          byType: lessonTypeCounts,
        },
        enrollments: {
          total: totalEnrollments,
        },
        engagement: {
          totalCompletedLessons: completedLessonsCount,
          totalProgressTracked: totalProgressEntries,
        },
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

const getAdminDashboard = async (req, res) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalCourses,
      totalLessons,
      totalEnrollments,
      recentUsers,
      recentCourses,
      recentEnrollments,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.course.count(),
      prisma.lesson.count(),
      prisma.enrollment.count(),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
      prisma.course.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          subject: true,
          createdAt: true,
          createdBy: {
            select: { id: true, name: true, email: true },
          },
          _count: {
            select: { lessons: true, enrollments: true },
          },
        },
      }),
      prisma.enrollment.findMany({
        take: 5,
        orderBy: { enrolledAt: "desc" },
        select: {
          id: true,
          enrolledAt: true,
          user: {
            select: { id: true, name: true, email: true },
          },
          course: {
            select: { id: true, title: true, subject: true },
          },
        },
      }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Admin dashboard data retrieved successfully",
      dashboard: {
        admin: req.user,
        metrics: {
          totalUsers,
          totalStudents,
          totalCourses,
          totalLessons,
          totalEnrollments,
        },
        recentActivity: {
          users: recentUsers,
          courses: recentCourses,
          enrollments: recentEnrollments,
        },
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

const getAdminUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;

    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const limitNumber = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNumber - 1) * limitNumber;

    const where = {};

    if (role && (role.toUpperCase() === "STUDENT" || role.toUpperCase() === "ADMIN")) {
      where.role = role.toUpperCase();
    }

    if (search && search.trim() !== "") {
      where.OR = [
        { name: { contains: search.trim(), mode: "insensitive" } },
        { email: { contains: search.trim(), mode: "insensitive" } },
      ];
    }

    const [totalUsers, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: limitNumber,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              enrollments: true,
              courses: true,
              progress: true,
            },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(totalUsers / limitNumber);

    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: {
        users,
        pagination: {
          total: totalUsers,
          page: pageNumber,
          limit: limitNumber,
          totalPages: totalPages === 0 ? 1 : totalPages,
        },
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

const getAdminCourses = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, subject } = req.query;

    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const limitNumber = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNumber - 1) * limitNumber;

    const where = {};

    if (search && search.trim() !== "") {
      where.title = {
        contains: search.trim(),
        mode: "insensitive",
      };
    }

    if (subject && subject.trim() !== "") {
      where.subject = {
        equals: subject.trim(),
        mode: "insensitive",
      };
    }

    const [totalCourses, courses] = await Promise.all([
      prisma.course.count({ where }),
      prisma.course.findMany({
        where,
        skip,
        take: limitNumber,
        orderBy: { createdAt: "desc" },
        include: {
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
              enrollments: true,
            },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(totalCourses / limitNumber);

    return res.status(200).json({
      success: true,
      message: "Admin courses list retrieved successfully",
      data: {
        courses,
        pagination: {
          total: totalCourses,
          page: pageNumber,
          limit: limitNumber,
          totalPages: totalPages === 0 ? 1 : totalPages,
        },
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
  getAdminStats,
  getAdminDashboard,
  getAdminUsers,
  getAdminCourses,
};