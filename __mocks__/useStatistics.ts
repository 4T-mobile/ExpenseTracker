export const useDashboard = jest.fn(() => ({
  data: {
    totalExpenses: 100,
    monthlyBudget: 500,
  },
  isLoading: false,
  refetch: jest.fn(),
  isRefetching: false,
  error: null,
  isError: false,
}));
