
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

module.exports = { createCourse };
