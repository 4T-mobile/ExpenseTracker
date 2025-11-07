import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { budgetsApi } from '../api/budgets';
import {
  CreateBudgetDto,
  UpdateBudgetDto,
} from '../types/budget.type';

const QUERY_KEYS = {
  budgets: ['budgets'] as const,
  budget: (id: string) => ['budgets', id] as const,
  currentBudget: ['budgets', 'current'] as const,
  budgetStatus: (id: string) => ['budgets', id, 'status'] as const,
};

export const useBudgets = (isActive?: boolean) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.budgets, { isActive }],
    queryFn: () => budgetsApi.getBudgets(isActive),
    staleTime: 0,
  });
};

export const useBudget = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.budget(id),
    queryFn: () => budgetsApi.getBudget(id),
    enabled: !!id,
  });
};

export const useCurrentBudget = () => {
  return useQuery({
    queryKey: QUERY_KEYS.currentBudget,
    queryFn: () => budgetsApi.getCurrentBudget(),
    staleTime: 0,
  });
};

export const useBudgetStatus = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.budgetStatus(id),
    queryFn: () => budgetsApi.getBudgetStatus(id),
    enabled: !!id,
    staleTime: 0,
  });
};

export const useCreateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateBudgetDto) => budgetsApi.createBudget(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.budgets });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.currentBudget });
    },
  });
};

export const useUpdateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateBudgetDto }) =>
      budgetsApi.updateBudget(id, dto),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.budget(variables.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.budgets });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.currentBudget });
    },
  });
};

export const useDeleteBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => budgetsApi.deleteBudget(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.budget(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.budgets });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.currentBudget });
    },
  });
};
