import api from "./api";

/**
 * Lesson Service
 * Communicates with backend endpoints:
 * - GET  /api/courses/:courseId/lessons/access (requires enrollment)
 * - GET  /api/lessons/:id (requires enrollment)
 * - POST /api/lessons/:lessonId/progress (toggle completion)
 * - GET  /api/lessons/:lessonId/progress
 */

export const lessonService = {
  // Get all lessons of a course with protected contentUrls and completion status
  getProtectedLessons: async (courseId) => {
    const response = await api.get(`/courses/${courseId}/lessons/access`);
    return response.data;
  },

  // Get specific lesson content details by ID
  getLessonById: async (lessonId) => {
    const response = await api.get(`/lessons/${lessonId}`);
    return response.data;
  },

  // Mark lesson as completed or incomplete
  updateLessonProgress: async (lessonId, completed = true) => {
    const response = await api.post(`/lessons/${lessonId}/progress`, {
      completed,
    });
    return response.data;
  },

  // Get progress for a specific lesson
  getLessonProgress: async (lessonId) => {
    const response = await api.get(`/lessons/${lessonId}/progress`);
    return response.data;
  },
};

export default lessonService;
