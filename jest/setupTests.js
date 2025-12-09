import "@testing-library/jest-native/extend-expect";

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));

jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: "light" },
}));

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

jest.mock("@/src/hooks/useStatistics", () => ({
  useDashboard: jest.fn(() => ({
    data: { todayTotal: 0, recentExpenses: [] },
    isLoading: false,
    refetch: jest.fn(),
    isRefetching: false,
    error: null,
    isError: false,
  })),
}));
