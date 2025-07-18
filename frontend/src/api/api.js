//api.js
import axios from 'axios';

// Create Axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // e.g., http://localhost:8080/api
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies for session-based authentication
});

// Request interceptor to attach token (for JWT-based auth)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Optional: clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login'; // or use navigate() if in React Router
    }
    return Promise.reject(error);
  }
);

export default api;
