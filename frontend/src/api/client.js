import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000', // Points directly to your FastAPI main.py port
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to format errors gracefully
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(`[API Error Response]: ${error.response?.status} - ${error.message}`);
    // Handle global errors like unauthenticated status if necessary
    return Promise.reject(error);
  }
);

export default apiClient;