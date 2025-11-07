import { apiClient } from './client';
import {
  Budget,
  CreateBudgetDto,
  UpdateBudgetDto,
  BudgetStatus,
} from '../types/budget.type';
import { ApiResponse } from '../types/common.type';

export const budgetsApi = {
  getBudgets: async (isActive?: boolean): Promise<Budget[]> => {
    const { data } = await apiClient.get<ApiResponse<Budget[]>>('/budgets', {
      params: { isActive },
    });
    return data.data;
  },

  getBudget: async (id: string): Promise<Budget> => {
    const { data } = await apiClient.get<ApiResponse<Budget>>(`/budgets/${id}`);
    return data.data;
  },

  getCurrentBudget: async (): Promise<BudgetStatus> => {
    const { data } = await apiClient.get<ApiResponse<BudgetStatus>>('/budgets/current');
    return data.data;
  },

  getBudgetStatus: async (id: string): Promise<BudgetStatus> => {
    const { data } = await apiClient.get<ApiResponse<BudgetStatus>>(
      `/budgets/${id}/status`
    );
    return data.data;
  },

  createBudget: async (dto: CreateBudgetDto): Promise<Budget> => {
    const { data } = await apiClient.post<ApiResponse<Budget>>('/budgets', dto);
    return data.data;
  },

  updateBudget: async (id: string, dto: UpdateBudgetDto): Promise<Budget> => {
    const { data } = await apiClient.put<ApiResponse<Budget>>(
      `/budgets/${id}`,
      dto
    );
    return data.data;
  },

  deleteBudget: async (id: string): Promise<void> => {
    await apiClient.delete(`/budgets/${id}`);
  },
};
