import api from "./api";

/**
 * Course Service
 * Communicates with backend endpoints:
 * - GET    /api/courses
 * - GET    /api/courses/:id
 * - GET    /api/courses/:courseId/lessons
 * - GET    /api/courses/:courseId/enrollment-status
 * - POST   /api/courses/:courseId/enroll
 */

export const courseService = {
  // Get all courses with optional search, subject filter, and pagination
  getAllCourses: async ({ search, subject, page = 1, limit = 9 } = {}) => {
    const params = {};
    if (search && search.trim()) params.search = search.trim();
    if (subject && subject.trim() && subject !== "ALL") params.subject = subject.trim();
    if (page) params.page = page;
    if (limit) params.limit = limit;

    const response = await api.get("/courses", { params });
    return response.data;
  },

  // Get specific course details with instructor and public lesson outline
  getCourseById: async (courseId) => {
    const response = await api.get(`/courses/${courseId}`);
    return response.data;
  },

  // Get public lessons syllabus for a course
  getCourseLessons: async (courseId) => {
    const response = await api.get(`/courses/${courseId}/lessons`);
    return response.data;
  },

  // Check enrollment status of currently logged in user
  getEnrollmentStatus: async (courseId) => {
    const response = await api.get(`/courses/${courseId}/enrollment-status`);
    return response.data;
  },

  // Enroll logged-in student in a course
  enrollInCourse: async (courseId) => {
    const response = await api.post(`/courses/${courseId}/enroll`);
    return response.data;
  },
};

export default courseService;
