import { apiClient } from './client';
import {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../types/category.type';
import { ApiResponse } from '../types/common.type';

export const categoriesApi = {
  getCategories: async (): Promise<Category[]> => {
    const { data } = await apiClient.get<ApiResponse<Category[]>>('/categories');
    return data.data;
  },

  getCategory: async (id: string): Promise<Category> => {
    const { data } = await apiClient.get<ApiResponse<Category>>(
      `/categories/${id}`
    );
    return data.data;
  },

  createCategory: async (dto: CreateCategoryDto): Promise<Category> => {
    const { data } = await apiClient.post<ApiResponse<Category>>(
      '/categories',
      dto
    );
    return data.data;
  },

  updateCategory: async (id: string, dto: UpdateCategoryDto): Promise<Category> => {
    const { data } = await apiClient.put<ApiResponse<Category>>(
      `/categories/${id}`,
      dto
    );
    return data.data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await apiClient.delete(`/categories/${id}`);
  },
};
