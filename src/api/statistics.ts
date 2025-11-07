import { apiClient } from './client';
import {
  DashboardStats,
  DailyStat,
  MonthlyStat,
  CategoryStat,
} from '../types/statistics.type';
import { ApiResponse } from '../types/common.type';

export const statisticsApi = {
  getDashboard: async (): Promise<DashboardStats> => {
    const { data } = await apiClient.get<ApiResponse<DashboardStats>>(
      '/statistics/dashboard'
    );
    return data.data;
  },

  getDailyStats: async (startDate: string, endDate: string): Promise<DailyStat[]> => {
    const { data } = await apiClient.get<ApiResponse<DailyStat[]>>(
      '/statistics/daily',
      {
        params: { startDate, endDate },
      }
    );
    return data.data;
  },

  getMonthlyStats: async (months: number = 6): Promise<MonthlyStat[]> => {
    const { data } = await apiClient.get<ApiResponse<MonthlyStat[]>>(
      '/statistics/monthly',
      {
        params: { months },
      }
    );
    return data.data;
  },

  getCategoryStats: async (startDate?: string, endDate?: string): Promise<CategoryStat[]> => {
    const { data } = await apiClient.get<ApiResponse<CategoryStat[]>>(
      '/statistics/by-category',
      {
        params: { startDate, endDate },
      }
    );
    return data.data;
  },
};
