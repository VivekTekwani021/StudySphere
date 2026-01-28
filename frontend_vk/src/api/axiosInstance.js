import axios from 'axios';
import { BASE_URL } from '../utils/constants';

// Create axios instance
// Note: Backend README documentation lists endpoints starting with /api (e.g., /api/auth).
// We adhere to the README as the Single Source of Truth for routes.
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for global error handling
api.interceptors.response.use(
    (response) => {
        // Return the data object directly if success is true,
        // or the whole response if the structure is different.
        // Based on "All responses MUST be parsed using the global response structure: { success, message, data }"
        return response;
    },
    (error) => {
        // Handle 401 Unauthorized globally
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Dispatch a custom event or use context to logout
            // For now, we'll just clear storage if it's a token issue
            // localStorage.removeItem('token');
            // window.location.href = '/login'; 
            // Commented out to prevent loops, handled in AuthContext
        }
        return Promise.reject(error);
    }
);

export default api;
