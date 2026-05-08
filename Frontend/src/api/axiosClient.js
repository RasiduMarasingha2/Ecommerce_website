import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:8070/api', // Matches backend port
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Crucial for sending HTTP-only cookies (JWT)
});

// Request interceptor (Optional if using strictly HTTP-Only cookies, 
// but good for attaching additional headers like CSRF tokens)
axiosClient.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Handle unauthorized access globally (e.g., redirect to login)
            console.error("Unauthorized: Please log in again.");
            // Optional: window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
