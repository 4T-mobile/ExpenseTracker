import { apiClient } from './client';
import {
  Expense,
  CreateExpenseDto,
  UpdateExpenseDto,
  ExpenseQuery,
  PaginatedExpenses,
} from '../types/expense.type';
import { ApiResponse } from '../types/common.type';

export const expensesApi = {
  getExpenses: async (query?: ExpenseQuery): Promise<PaginatedExpenses> => {
    const { data } = await apiClient.get<ApiResponse<{
      expenses: Expense[];
      pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>>('/expenses', {
      params: query,
    });

    return {
      data: data.data.expenses,
      meta: {
        total: data.data.pagination.total,
        page: data.data.pagination.page,
        limit: data.data.pagination.limit,
        totalPages: data.data.pagination.totalPages,
      },
    };
  },

  getExpense: async (id: string): Promise<Expense> => {
    const { data } = await apiClient.get<ApiResponse<Expense>>(`/expenses/${id}`);
    return data.data;
  },

  createExpense: async (dto: CreateExpenseDto): Promise<Expense> => {
    const { data } = await apiClient.post<ApiResponse<Expense>>('/expenses', dto);
    return data.data;
  },

  updateExpense: async (id: string, dto: UpdateExpenseDto): Promise<Expense> => {
    const { data } = await apiClient.put<ApiResponse<Expense>>(
      `/expenses/${id}`,
      dto
    );
    return data.data;
  },

  deleteExpense: async (id: string): Promise<void> => {
    await apiClient.delete(`/expenses/${id}`);
  },

  getRecentExpenses: async (limit: number = 10): Promise<Expense[]> => {
    const { data } = await apiClient.get<ApiResponse<Expense[]>>('/expenses/recent', {
      params: { limit },
    });
    return data.data;
  },
};
