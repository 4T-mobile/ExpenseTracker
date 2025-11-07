import { useQuery } from '@tanstack/react-query';
import { statisticsApi } from '../api/statistics';

const QUERY_KEYS = {
  dashboard: ['statistics', 'dashboard'] as const,
  dailyStats: (startDate: string, endDate: string) =>
    ['statistics', 'daily', startDate, endDate] as const,
  monthlyStats: (months: number) =>
    ['statistics', 'monthly', months] as const,
  categoryStats: (startDate?: string, endDate?: string) =>
    ['statistics', 'by-category', startDate, endDate] as const,
};

export const useDashboard = () => {
  return useQuery({
    queryKey: QUERY_KEYS.dashboard,
    queryFn: () => statisticsApi.getDashboard(),
    staleTime: 1000 * 60 * 5,
    refetchOnMount: 'always',
  });
};

export const useDailyStats = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.dailyStats(startDate, endDate),
    queryFn: () => statisticsApi.getDailyStats(startDate, endDate),
    enabled: !!startDate && !!endDate,
    staleTime: 1000 * 60 * 5,
  });
};

export const useMonthlyStats = (months: number = 6) => {
  return useQuery({
    queryKey: QUERY_KEYS.monthlyStats(months),
    queryFn: () => statisticsApi.getMonthlyStats(months),
    staleTime: 1000 * 60 * 10,
  });
};

export const useCategoryStats = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.categoryStats(startDate, endDate),
    queryFn: () => statisticsApi.getCategoryStats(startDate, endDate),
    staleTime: 1000 * 60 * 5,
  });
};
