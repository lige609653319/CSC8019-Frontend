import axios from 'axios';
import { message } from 'antd';

// Create an axios instance
const request = axios.create({
  baseURL: 'http://localhost:8080', // Replace with your backend base URL
  timeout: 10000,
});

// Response interceptor
request.interceptors.response.use(
  (response) => {
    const res = response.data;

    // Check if the business code is 200
    if (res.code !== 200) {
      // Pop up error message from the response data
      message.error(res.message || 'Unknown error occurred');
      
      // Reject the promise to stop the chain
      return Promise.reject(new Error(res.message || 'Unknown error occurred'));
    }

    return res;
  },
  (error) => {
    // Handle network errors, timeouts, etc.
    console.error('Request failed:', error);
    message.error(error.message || 'Network error');
    return Promise.reject(error);
  }
);

export default request;
