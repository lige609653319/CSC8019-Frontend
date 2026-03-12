import request from '../../utils/request';

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
  // Use the global request utility which has the 403/401 interceptors
  const response: any = await request.get('/api/loyalty/me');
  // request.ts unwraps the data if code is 200
  return response.data;
};

/** @param limit between 1 and 50 (validated by backend) */
export const fetchLoyaltyTransactions = async (
  limit: number = 50
): Promise<LoyaltyTxDto[]> => {
  const response: any = await request.get(
    `/api/loyalty/me/transactions?limit=${Math.min(50, Math.max(1, limit))}`
  );
  return response.data;
};

