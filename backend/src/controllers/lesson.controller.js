const prisma = require("../db");

const ALLOWED_LESSON_TYPES = ["VIDEO", "PDF", "NOTE"];

const createLesson = async (req, res) => {
  try {
    const courseId = parseInt(req.params.courseId, 10);

    if (isNaN(courseId) || courseId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID. ID must be a positive integer.",
      });
    }

    const { title, description, type, contentUrl } = req.body;

    if (!title || !type) {
      return res.status(400).json({
        success: false,
        message: "Title and type are required",
      });
    }

    const normalizedType = type.toUpperCase();
    if (!ALLOWED_LESSON_TYPES.includes(normalizedType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid lesson type '${type}'. Allowed types are: ${ALLOWED_LESSON_TYPES.join(", ")}`,
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

    const lesson = await prisma.lesson.create({
      data: {
        title: title.trim(),
        description: description ? description.trim() : null,
        type: normalizedType,
        contentUrl: contentUrl ? contentUrl.trim() : null,
        courseId,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Lesson created successfully",
      lesson,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getLessonsByCourse = async (req, res) => {
  try {
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

    // Public syllabus overview: returns curriculum metadata without protected contentUrl
    const lessons = await prisma.lesson.findMany({
      where: { courseId },
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        courseId: true,
        createdAt: true,
      },
      orderBy: { id: "asc" },
    });

    return res.status(200).json({
      success: true,
      message: "Lessons fetched successfully",
      courseId,
      count: lessons.length,
      lessons,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getProtectedCourseLessons = async (req, res) => {
  try {
    const courseId = parseInt(req.params.courseId, 10);
    const userId = req.user.userId;
    const userRole = req.user.role;

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

    // Verify enrollment for students (Admins and course creators bypass enrollment check)
    if (userRole !== "ADMIN" && course.createdById !== userId) {
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
      });

      if (!enrollment) {
        return res.status(403).json({
          success: false,
          message: "Access denied. You must enroll in this course to access protected lesson content.",
        });
      }
    }

    const [lessons, userProgress] = await Promise.all([
      prisma.lesson.findMany({
        where: { courseId },
        orderBy: { id: "asc" },
      }),
      prisma.progress.findMany({
        where: {
          userId,
          completed: true,
        },
        select: {
          lessonId: true,
        },
      }),
    ]);

    const completedLessonIdSet = new Set(userProgress.map((p) => p.lessonId));

    const protectedLessons = lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      type: lesson.type,
      contentUrl: lesson.contentUrl,
      courseId: lesson.courseId,
      createdAt: lesson.createdAt,
      isCompleted: completedLessonIdSet.has(lesson.id),
    }));

    return res.status(200).json({
      success: true,
      message: "Protected course lessons retrieved successfully",
      courseId,
      count: protectedLessons.length,
      lessons: protectedLessons,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getLessonById = async (req, res) => {
  try {
    const lessonId = parseInt(req.params.id, 10);
    const userId = req.user.userId;
    const userRole = req.user.role;

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
            createdById: true,
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
    if (userRole !== "ADMIN" && lesson.course.createdById !== userId) {
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
          message: "Access denied. You must enroll in this course to access lesson content.",
        });
      }
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
      message: "Lesson content accessed successfully",
      lesson: {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        type: lesson.type,
        contentUrl: lesson.contentUrl,
        courseId: lesson.courseId,
        course: {
          id: lesson.course.id,
          title: lesson.course.title,
          subject: lesson.course.subject,
        },
        isCompleted: progress ? progress.completed : false,
        createdAt: lesson.createdAt,
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

const updateLesson = async (req, res) => {
  try {
    const lessonId = parseInt(req.params.id, 10);

    if (isNaN(lessonId) || lessonId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid lesson ID. ID must be a positive integer.",
      });
    }

    const { title, description, type, contentUrl } = req.body;

    if (!title && description === undefined && !type && contentUrl === undefined) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required to update",
      });
    }

    const existingLesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!existingLesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    const dataToUpdate = {};
    if (title !== undefined && title.trim() !== "") {
      dataToUpdate.title = title.trim();
    }
    if (description !== undefined) {
      dataToUpdate.description = description ? description.trim() : null;
    }
    if (contentUrl !== undefined) {
      dataToUpdate.contentUrl = contentUrl ? contentUrl.trim() : null;
    }
    if (type !== undefined) {
      const normalizedType = type.toUpperCase();
      if (!ALLOWED_LESSON_TYPES.includes(normalizedType)) {
        return res.status(400).json({
          success: false,
          message: `Invalid lesson type '${type}'. Allowed types are: ${ALLOWED_LESSON_TYPES.join(", ")}`,
        });
      }
      dataToUpdate.type = normalizedType;
    }

    const updatedLesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: dataToUpdate,
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

    return res.status(200).json({
      success: true,
      message: "Lesson updated successfully",
      lesson: updatedLesson,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteLesson = async (req, res) => {
  try {
    const lessonId = parseInt(req.params.id, 10);

    if (isNaN(lessonId) || lessonId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid lesson ID. ID must be a positive integer.",
      });
    }

    const existingLesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!existingLesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    // Cascade delete automatically handles related Progress records
    await prisma.lesson.delete({
      where: { id: lessonId },
    });

    return res.status(200).json({
      success: true,
      message: "Lesson and related progress deleted successfully",
      lessonId,
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
  createLesson,
  getLessonsByCourse,
  getProtectedCourseLessons,
  getLessonById,
  updateLesson,
  deleteLesson,
};