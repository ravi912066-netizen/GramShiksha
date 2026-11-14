import api from "./api";

/**
 * Authentication Service
 * Communicates with backend endpoints:
 * - POST /api/auth/register
 * - POST /api/auth/login
 * - GET  /api/users/profile
 */

export const authService = {
  // Register new student
  register: async ({ name, email, password }) => {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
    });
    return response.data;
  },

  // Log in existing user (STUDENT or ADMIN)
  login: async ({ email, password }) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });
    return response.data;
  },

  // Fetch verified profile of currently logged-in user
  getProfile: async () => {
    const response = await api.get("/users/profile");
    return response.data;
  },
};

export default authService;
