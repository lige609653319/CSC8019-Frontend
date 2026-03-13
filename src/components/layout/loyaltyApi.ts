/**
 * Loyalty API – uses shared request (utils/request) so Authorization is set automatically.
 */
import request from '../../utils/request';

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

/** Response shape from backend Result<T> (request interceptor returns this). */
interface ApiResult<T> {
  code: number;
  message: string;
  data: T;
}

export const fetchLoyaltyBalance = async (): Promise<LoyaltySummaryDto> => {
  const res = await request.get<ApiResult<LoyaltySummaryDto>>('/api/loyalty/me');
  return (res as ApiResult<LoyaltySummaryDto>).data;
};

/** @param limit between 1 and 50 (validated by backend) */
export const fetchLoyaltyTransactions = async (
  limit: number = 50
): Promise<LoyaltyTxDto[]> => {
  const res = await request.get<ApiResult<LoyaltyTxDto[]>>(
    `/api/loyalty/me/transactions?limit=${Math.min(50, Math.max(1, limit))}`
  );
  return (res as ApiResult<LoyaltyTxDto[]>).data;
};
