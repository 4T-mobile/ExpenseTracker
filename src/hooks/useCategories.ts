import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesApi } from '../api/categories';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../types/category.type';

const QUERY_KEYS = {
  categories: ['categories'] as const,
  category: (id: string) => ['categories', id] as const,
};

export const useCategories = () => {
  return useQuery({
    queryKey: QUERY_KEYS.categories,
    queryFn: () => categoriesApi.getCategories(),
    staleTime: Infinity,
  });
};

export const useCategory = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.category(id),
    queryFn: () => categoriesApi.getCategory(id),
    enabled: !!id,
    staleTime: Infinity,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateCategoryDto) => categoriesApi.createCategory(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateCategoryDto }) =>
      categoriesApi.updateCategory(id, dto),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.category(variables.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoriesApi.deleteCategory(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.category(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories });
    },
  });
};
