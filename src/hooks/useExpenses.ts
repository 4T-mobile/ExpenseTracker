import {
  useQuery,
  useMutation,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { expensesApi } from '../api/expenses';
import {
  Expense,
  CreateExpenseDto,
  UpdateExpenseDto,
  ExpenseQuery,
} from '../types/expense.type';

const QUERY_KEYS = {
  expenses: ['expenses'] as const,
  expense: (id: string) => ['expenses', id] as const,
  recentExpenses: (limit: number) => ['expenses', 'recent', limit] as const,
};

export const useExpenses = (query?: ExpenseQuery) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.expenses, query],
    queryFn: () => expensesApi.getExpenses(query),
    staleTime: 0,
  });
};

export const useInfiniteExpenses = (query?: ExpenseQuery) => {
  return useInfiniteQuery({
    queryKey: [...QUERY_KEYS.expenses, 'infinite', query],
    queryFn: ({ pageParam = 1 }) =>
      expensesApi.getExpenses({ ...query, page: pageParam }),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.meta;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 0,
  });
};

export const useExpense = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.expense(id),
    queryFn: () => expensesApi.getExpense(id),
    enabled: !!id,
  });
};

export const useRecentExpenses = (limit: number = 10) => {
  return useQuery({
    queryKey: QUERY_KEYS.recentExpenses(limit),
    queryFn: () => expensesApi.getRecentExpenses(limit),
    staleTime: 0,
  });
};

export const useAddExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateExpenseDto) => expensesApi.createExpense(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.expenses });
      queryClient.invalidateQueries({ queryKey: ['statistics'] });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
};

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateExpenseDto }) =>
      expensesApi.updateExpense(id, dto),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.expense(variables.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.expenses });
      queryClient.invalidateQueries({ queryKey: ['statistics'] });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => expensesApi.deleteExpense(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.expense(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.expenses });
      queryClient.invalidateQueries({ queryKey: ['statistics'] });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
};
