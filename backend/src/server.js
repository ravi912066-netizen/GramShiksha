
const env = require("./config/env");
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const adminRoutes = require("./routes/admin.routes");
const courseRoutes = require("./routes/course.routes");
const lessonRoutes = require("./routes/lesson.routes");
const { notFoundHandler, errorHandler } = require("./middleware/error.middleware");

const app = express();

// Middlewares
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "GramShiksha server is running",
  });
});

// 404 & Centralized Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = env.PORT;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
