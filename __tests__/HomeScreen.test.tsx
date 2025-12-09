import React from "react";
import { render } from "@testing-library/react-native";
import HomeScreen from "../app/(main)/home";

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("@/src/hooks/useStatistics", () => ({
  useDashboard: jest.fn(() => ({
    data: {
      budgetStatus: null,
      todayTotal: 0,
      weekTotal: 0,
      monthTotal: 0,
      averageDailySpending: 0,
      recentExpenses: [],
    },
    isLoading: false,
    refetch: jest.fn(),
    isRefetching: false,
    error: null,
    isError: false,
  })),
}));

test("HomeScreen renders", () => {
  render(<HomeScreen />);
});
