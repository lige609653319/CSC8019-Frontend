import axios from 'axios';
import { message } from 'antd';

// Create an axios instance
const request = axios.create({
  baseURL: 'http://localhost:8080', // Replace with your backend base URL
  timeout: 10000,
});

// Request interceptor
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = token; // token already contains prefix e.g. "Bearer eyJhbG..."
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
request.interceptors.response.use(
  (response) => {
    const res = response.data;

    // Check if the business code is 200
    if (res.code !== 200) {
      // 401 Unauthorized handling
      if (res.code === 401 || response.status === 401) {
        const isLoginRequest = response.config.url?.includes('/api/auth/login');
        const token = localStorage.getItem('token');
        
        localStorage.removeItem('token');
        
        // Only reload if it's NOT a login request and we HAD a token
        if (!isLoginRequest && token) {
          window.location.reload();
        }
        message.error(res.message || 'Session expired. Please log in again.');
        return Promise.reject({
          response: { status: 401, data: res },
          message: res.message || 'Unauthorized'
        });
      }

      // 403 Forbidden handling
      if (res.code === 403 || response.status === 403) {
        message.error(res.message || 'Access denied: No permission');
        return Promise.reject({
          response: { status: 403, data: res },
          message: res.message || 'Forbidden'
        });
      }
      
      message.error(res.message || 'Unknown error occurred');
      return Promise.reject({
        response: { status: res.code, data: res },
        message: res.message || 'Business error'
      });
    }



    return res;
  },
  (error) => {
    // Handle network errors, timeouts, and HTTP status codes
    if (error.response && error.response.status === 401) {
      const isLoginRequest = error.config?.url?.includes('/api/auth/login');
      const token = localStorage.getItem('token');
      
      localStorage.removeItem('token');
      
      // Only reload if it's NOT a login request and we HAD a token
      if (!isLoginRequest && token) {
        window.location.reload();
      }
    }

    if (error.response && error.response.status === 403) {
      message.error(error.response.data?.message || 'Access denied: No permission');
      return Promise.reject(error);
    }

    console.error('Request failed:', error);
    message.error(error.response?.data?.message || error.message || 'Network error');
    return Promise.reject(error);
  }


);

export default request;

