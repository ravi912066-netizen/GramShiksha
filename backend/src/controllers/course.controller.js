
const prisma = require("../db");

const createCourse = async (req, res) => {
  try {
    const { title, description, subject } = req.body;

    if (!title || !description || !subject) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        subject,
        createdById: req.user.userId,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const { search, subject, page = 1, limit = 10 } = req.query;

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
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    const totalPages = Math.ceil(totalCourses / limitNumber);

    return res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
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

const getCourseById = async (req, res) => {
  try {
    const courseId = parseInt(req.params.id, 10);

    if (isNaN(courseId) || courseId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID. ID must be a positive integer.",
      });
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
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
            description: true,
            type: true,
            createdAt: true,
          },
          orderBy: {
            id: "asc",
          },
        },
        _count: {
          select: {
            enrollments: true,
            lessons: true,
          },
        },
      },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course details fetched successfully",
      course,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateCourse = async (req, res) => {
  try {
    const courseId = parseInt(req.params.id, 10);

    if (isNaN(courseId) || courseId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID. ID must be a positive integer.",
      });
    }

    const { title, description, subject } = req.body;

    if (!title && !description && !subject) {
      return res.status(400).json({
        success: false,
        message: "At least one field (title, description, or subject) is required to update",
      });
    }

    const existingCourse = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const dataToUpdate = {};
    if (title !== undefined && title.trim() !== "") dataToUpdate.title = title.trim();
    if (description !== undefined && description.trim() !== "") dataToUpdate.description = description.trim();
    if (subject !== undefined && subject.trim() !== "") dataToUpdate.subject = subject.trim();

    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: dataToUpdate,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const courseId = parseInt(req.params.id, 10);

    if (isNaN(courseId) || courseId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID. ID must be a positive integer.",
      });
    }

    const existingCourse = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Related lessons and enrollments are deleted automatically via Prisma/PostgreSQL CASCADE
    await prisma.course.delete({
      where: { id: courseId },
    });

    return res.status(200).json({
      success: true,
      message: "Course and related records deleted successfully",
      courseId,
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
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
