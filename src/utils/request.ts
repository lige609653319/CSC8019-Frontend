import axios from 'axios';
import { message } from 'antd';

// In dev, use empty baseURL so Vite proxy can forward /api to backend
const request = axios.create({
  baseURL: import.meta.env.DEV ? '' : 'http://localhost:8080',
  timeout: 10000,
});

// Request interceptor: add JWT so Loyalty and other protected APIs get the token
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }
    return config;
  },
  (e) => Promise.reject(e)
);

// Response interceptor
request.interceptors.response.use(
  (response) => {
    const res = response.data;

    if (res.code !== 200) {
      message.error(res.message || 'Unknown error occurred');
      return Promise.reject(new Error(res.message || 'Unknown error occurred'));
    }

    return res;
  },
  (error) => {
    console.error('Request failed:', error);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      message.error('Session expired. Please log in again.');
      window.location.reload();
      return Promise.reject(error);
    }
    const isNetworkError = !error.response && (error.code === 'ERR_NETWORK' || error.message === 'Network Error');
    const msg = isNetworkError
      ? 'Cannot reach server. Make sure the backend is running on http://localhost:8080'
      : (error.response?.data?.message || error.message || 'Request failed');
    message.error(msg);
    return Promise.reject(error);
  }
);

export default request;
