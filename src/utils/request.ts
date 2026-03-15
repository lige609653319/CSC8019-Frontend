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
        console.log('🚀 Request:', config.method?.toUpperCase(), config.url, config.headers);
        return config;
    },
    (e) => Promise.reject(e)
);

// Response interceptor
request.interceptors.response.use(
    (response) => {
        const res = response.data;
        console.log('✅ Response received:', response.config.url, 'Status:', response.status);
        console.log('📦 Response data:', res);


        if (Array.isArray(res)) {
            console.log('📦 Array response detected, wrapping in standard format');
            return {
                code: 200,
                data: res,
                message: 'Success'
            };
        }


        if (res && typeof res === 'object') {
            // 如果 code 为 200，直接返回
            if (res.code === 200) {
                return res;
            }


            console.error('❌ Business error:', res.code, res.message);


            if (res.code === 401 || response.status === 401) {
                const isLoginRequest = response.config.url?.includes('/api/auth/login');
                const hadToken = !!localStorage.getItem('token');
                localStorage.removeItem('token');
                if (!isLoginRequest && hadToken) window.location.reload();
                message.error(res.message || 'Session expired. Please log in again.');
                return Promise.reject({
                    response: { status: 401, data: res },
                    message: res.message || 'Unauthorized',
                });
            }


            if (res.code === 403 || response.status === 403) {
                message.error(res.message || 'Access denied: No permission');
                return Promise.reject({
                    response: { status: 403, data: res },
                    message: res.message || 'Forbidden',
                });
            }


            message.error(res.message || 'Unknown error occurred');
            return Promise.reject(new Error(res.message || 'Unknown error occurred'));
        }


        console.log('📦 Other response type detected:', typeof res);
        return {
            code: 200,
            data: res,
            message: 'Success'
        };
    },
    (error) => {
        console.error('❌ HTTP Error:', error);

        if (error.response?.status === 401) {
            const isLoginRequest = error.config?.url?.includes('/api/auth/login');
            const hadToken = !!localStorage.getItem('token');
            localStorage.removeItem('token');
            if (!isLoginRequest && hadToken) window.location.reload();
            message.error(error.response?.data?.message || 'Session expired. Please log in again.');
        } else if (error.response?.status === 403) {
            message.error(error.response?.data?.message || 'Access denied: No permission');
        } else {
            const isNetworkError = !error.response && (error.code === 'ERR_NETWORK' || error.message === 'Network Error');
            const msg = isNetworkError
                ? 'Cannot reach server. Make sure the backend is running on http://localhost:8080'
                : (error.response?.data?.message || error.message || 'Request failed');
            message.error(msg);
        }
        console.error('Request failed:', error);
        return Promise.reject(error);
    }
);

export default request;