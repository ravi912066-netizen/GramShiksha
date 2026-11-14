import api from "./api";

/**
 * Admin Service
 * Communicates with backend endpoints:
 * - GET    /api/admin/dashboard
 * - POST   /api/courses (admin only)
 * - PUT    /api/courses/:id (admin only)
 * - DELETE /api/courses/:id (admin only)
 * - POST   /api/courses/:courseId/lessons (admin only)
 * - PUT    /api/lessons/:id (admin only)
 * - DELETE /api/lessons/:id (admin only)
 */

export const adminService = {
  // Get admin status from backend
  getAdminDashboard: async () => {
    const response = await api.get("/admin/dashboard");
    return response.data;
  },

  // Derive real platform statistics from the database
  getPlatformStats: async () => {
    const response = await api.get("/courses", {
      params: { limit: 100 },
    });

    const courses = response.data?.data?.courses || [];
    const totalCourses = response.data?.data?.pagination?.total || courses.length;

    let totalLessons = 0;
    let totalEnrollments = 0;

    courses.forEach((c) => {
      totalLessons += c._count?.lessons || 0;
      totalEnrollments += c._count?.enrollments || 0;
    });

    return {
      totalCourses,
      totalLessons,
      totalEnrollments,
      // Integration note: total student user count endpoint is in progress by backend team
      totalStudentsNote: "Pending backend /api/admin/students implementation",
    };
  },

  // Create course
  createCourse: async ({ title, description, subject }) => {
    const response = await api.post("/courses", {
      title,
      description,
      subject,
    });
    return response.data;
  },

  // Update course
  updateCourse: async (courseId, data) => {
    const response = await api.put(`/courses/${courseId}`, data);
    return response.data;
  },

  // Delete course
  deleteCourse: async (courseId) => {
    const response = await api.delete(`/courses/${courseId}`);
    return response.data;
  },

  // Create lesson for a course
  createLesson: async (courseId, { title, description, type, contentUrl }) => {
    const response = await api.post(`/courses/${courseId}/lessons`, {
      title,
      description,
      type,
      contentUrl,
    });
    return response.data;
  },

  // Update existing lesson
  updateLesson: async (lessonId, data) => {
    const response = await api.put(`/lessons/${lessonId}`, data);
    return response.data;
  },

  // Delete lesson
  deleteLesson: async (lessonId) => {
    const response = await api.delete(`/lessons/${lessonId}`);
    return response.data;
  },

  /**
   * INTEGRATION NOTE:
   * GET /api/admin/students
   * The backend currently lacks an endpoint to list all registered users/students.
   * This stub is ready to connect as soon as the backend team deploys the route.
   */
  getStudents: async () => {
    try {
      const response = await api.get("/admin/students");
      return response.data;
    } catch (err) {
      // Graceful fallback integration notice
      return {
        isPendingBackend: true,
        message:
          "The backend student management endpoint (GET /api/admin/students) is currently in development.",
        students: [],
      };
    }
  },
};

export default adminService;
