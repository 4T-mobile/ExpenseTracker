import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-reanimated";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useColorScheme } from "@/components/useColorScheme";
export { ErrorBoundary } from "expo-router";

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontsError] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  const [isLoggedIn, setLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (fontsError) throw fontsError;
    if (fontsLoaded) {
      (async () => {
        const token = await AsyncStorage.getItem("token");
        setLoggedIn(!!token);
        SplashScreen.hideAsync();
      })();
    }
  }, [fontsLoaded, fontsError]);

  useEffect(() => {
    if (isLoggedIn === null) return;
    if (isLoggedIn) {
      router.replace("/(main)/home");
    } else {
      router.replace("/(auth)/login");
    }
  }, [isLoggedIn]);

  if (!fontsLoaded || isLoggedIn === null) return null;

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(main)" />
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
