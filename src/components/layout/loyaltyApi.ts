import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,
});

// إرفاق JWT في الطلبات المحمية (login_guide: Authorization: Bearer <token>)
api.interceptors.request.use((config) => {
  const token = typeof localStorage !== 'undefined' && localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface ApiResult<T> {
  code: number;
  message: string;
  data: T;
}

export interface LoyaltySummaryDto {
  username: string;
  pointsBalance: number;
}

export interface LoyaltyTxDto {
  id: number;
  type: 'EARN' | 'REDEEM' | 'ADJUST';
  points: number;
  orderId: number | null;
  note: string;
  createdAt: string;
}

export const fetchLoyaltyBalance = async (): Promise<LoyaltySummaryDto> => {
  const response = await api.get<ApiResult<LoyaltySummaryDto>>('/loyalty/me');
  return response.data.data;
};

/** @param limit between 1 and 50 (validated by backend) */
export const fetchLoyaltyTransactions = async (
  limit: number = 50
): Promise<LoyaltyTxDto[]> => {
  const response = await api.get<ApiResult<LoyaltyTxDto[]>>(
    `/loyalty/me/transactions?limit=${Math.min(50, Math.max(1, limit))}`
  );
  return response.data.data;
};