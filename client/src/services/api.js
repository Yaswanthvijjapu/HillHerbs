import axios from 'axios';

// Use the environment variable, or fallback to localhost for development
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

// Interceptor to add the JWT token to every request if it exists
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

export default api;