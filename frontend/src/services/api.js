import axios from "axios";

// Configurable API base URL with fallback to standard local backend
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Request Interceptor: Attach JWT Bearer Token if present
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("gramshiksha_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn("Could not read auth token from localStorage:", e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global 401 (Unauthorized) handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If we got 401 and we have a stored token, the token has expired or is invalid
      const token = localStorage.getItem("gramshiksha_token");
      if (token) {
        localStorage.removeItem("gramshiksha_token");
        localStorage.removeItem("gramshiksha_user");
        // Dispatch custom event for AuthContext to sync
        window.dispatchEvent(new Event("auth:unauthorized"));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
