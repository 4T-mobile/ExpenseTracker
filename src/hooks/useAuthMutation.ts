import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import * as Sentry from "@sentry/react-native";
import { login, register, logout, getProfile } from "../api/auth";
import { tokenStorage, userStorage } from "../utils/storage";
import { onboardingStorage } from "../utils/onboardingStorage";

export const useLoginMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: async (res) => {
      const { accessToken, refreshToken, user } = res.data.data;

      if (!accessToken || !refreshToken) {
        throw new Error("Invalid response: missing tokens");
      }

      if (!user) {
        throw new Error("Invalid response: missing user data");
      }

      await tokenStorage.setToken(accessToken);
      await tokenStorage.setRefreshToken(refreshToken);
      await userStorage.setUser(user);

      // Set user context in Sentry for crash-free users tracking
      Sentry.setUser({
        id: user.id,
        username: user.username,
        email: user.email,
      });

      queryClient.setQueryData(["user"], user);

      const hasCompletedOnboarding = await onboardingStorage.isCompleted();
      if (hasCompletedOnboarding) {
        router.replace("/(main)/home");
      } else {
        router.replace("/onboarding");
      }
    },
  });
};

export const useRegisterMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: register,
    onSuccess: async (res) => {
      const { accessToken, refreshToken, user } = res.data.data;

      if (!accessToken || !refreshToken) {
        throw new Error("Invalid response: missing tokens");
      }

      if (!user) {
        throw new Error("Invalid response: missing user data");
      }

      await tokenStorage.setToken(accessToken);
      await tokenStorage.setRefreshToken(refreshToken);
      await userStorage.setUser(user);

      // Set user context in Sentry for crash-free users tracking
      Sentry.setUser({
        id: user.id,
        username: user.username,
        email: user.email,
      });

      queryClient.setQueryData(["user"], user);
      router.replace("/onboarding");
    },
  });
};

export const useLogoutMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      await tokenStorage.clearTokens();
      await userStorage.clearUser();

      // Clear user context in Sentry
      Sentry.setUser(null);

      queryClient.clear();
      router.replace("/(auth)/login");
    },
    onError: async () => {
      await tokenStorage.clearTokens();
      await userStorage.clearUser();

      // Clear user context in Sentry
      Sentry.setUser(null);

      queryClient.clear();
      router.replace("/(auth)/login");
    },
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await getProfile();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
