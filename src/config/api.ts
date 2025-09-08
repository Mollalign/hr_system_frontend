import axios from "axios";

// Environment-based configuration
const isDevelopment = import.meta.env.DEV || import.meta.env.VITE_NODE_ENV === "development";

// Main API instance
const api = axios.create({
   baseURL: isDevelopment
    ? "http://localhost:8000/api"
    : "https://your-production-domain.com/api",
    withCredentials: true,
    timeout: 30000,
});

// Base URL for other purposes (like file uploads, etc.)
const baseURL = isDevelopment
  ? "http://localhost:8000/"
  : "https://your-production-domain.com/";

// Add response interceptor for error handling (KEEP THIS ONE)  
api.interceptors.response.use(
    (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      // This part is still correct and important!
      if (status === 401) {
        // On a 401 Unauthorized error, the server is rejecting our cookie.
        // The most logical action is to clear frontend state and redirect to login.
        // localStorage.removeItem('userData'); // Clear any user data in localStorage
        // window.location.href = '/login';
      }
      
      // Throw a user-friendly error message from the server
      throw new Error(data?.message || `HTTP error! status: ${status}`);
    } else if (error.request) {
      throw new Error('Network error occurred. Please check your connection.');
    } else {
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
)

// Export the configured axios instance and utilities
export default api;
export { baseURL };