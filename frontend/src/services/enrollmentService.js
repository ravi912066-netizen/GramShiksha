import api from "./api";

/**
 * Enrollment Service
 * Communicates with backend endpoints:
 * - POST /api/courses/:courseId/enroll
 * - GET  /api/courses/:courseId/enrollment-status
 * - GET  /api/users/enrollments
 */

export const enrollmentService = {
  // Enroll currently authenticated student in a course
  enroll: async (courseId) => {
    const response = await api.post(`/courses/${courseId}/enroll`);
    return response.data;
  },

  // Check enrollment status for course
  getStatus: async (courseId) => {
    const response = await api.get(`/courses/${courseId}/enrollment-status`);
    return response.data;
  },

  // Get all enrollments for the student
  getMyEnrollments: async () => {
    const response = await api.get("/users/enrollments");
    return response.data;
  },
};

export default enrollmentService;
