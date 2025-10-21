import { useMutation } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { login, register } from "../api/auth";
import { logError } from "../utils/logger";

export const useLoginMutation = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: login,
    onSuccess: async (res) => {
      await AsyncStorage.setItem("token", res.data.token);
      router.replace("/(main)/home");
    },
    onError: (err) => {
      logError(err, "login");
    },
  });
};

export const useRegisterMutation = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: register,
    onSuccess: async (res) => {
      await AsyncStorage.setItem("token", res.data.token);
      router.replace("/(main)/home");
    },
    onError: (err) => {
      logError(err, "register");
    },
  });
};
