import api from "./api";

/**
 * User & Learning Services
 * Communicates with backend endpoints:
 * - GET /api/users/dashboard
 * - GET /api/users/profile
 * - GET /api/users/enrollments
 * - GET /api/users/progress
 * - GET /api/users/recommendations
 */

export const userService = {
  // Get complete student dashboard data
  getDashboard: async () => {
    const response = await api.get("/users/dashboard");
    return response.data;
  },

  // Get user profile details
  getProfile: async () => {
    const response = await api.get("/users/profile");
    return response.data;
  },

  // Get user's enrolled courses list
  getUserEnrollments: async () => {
    const response = await api.get("/users/enrollments");
    return response.data;
  },

  // Get user's full progress breakdown across all courses
  getUserOverallProgress: async () => {
    const response = await api.get("/users/progress");
    return response.data;
  },

  // Get personalized course recommendations
  getRecommendations: async () => {
    const response = await api.get("/users/recommendations");
    return response.data;
  },
};

export default userService;
