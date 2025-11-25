// src/api/api.js 
import axios from 'axios';

// ✅ STEP 1: Check your backend terminal to see which PORT it is running on (usually 5000, 3000, or 8080)
const LOCAL_API_URL = 'http://localhost:5000'; 
const PROD_API_URL = 'https://api-bqojuh5xfq-uc.a.run.app';

const api = axios.create({
  // ✅ STEP 2: Uncomment the one you want to use
  baseURL: LOCAL_API_URL,     // <--- USE THIS FOR LOCAL TESTING
  // baseURL: PROD_API_URL,   // <--- USE THIS FOR DEPLOYMENT
  
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      // Clear invalid tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userType');
      localStorage.removeItem('studentUid');
      // Redirect to login if needed
      window.location.href = '/login/student';
    }
    
    return Promise.reject(error);
  }
);

export default api;