import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Send cookies with every request
    timeout: 15000,
});

// Response interceptor — handle 401 globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Only redirect if not already on auth pages
            if (
                !window.location.pathname.includes('/login') &&
                !window.location.pathname.includes('/signup')
            ) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
