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
import "react-native-reanimated";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useColorScheme } from "@/components/useColorScheme";
import { tokenStorage, clearAllStorage } from "@/src/utils/storage";
import { onboardingStorage } from "@/src/utils/onboardingStorage";
import { setSessionExpiredHandler } from "@/src/api/client";
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "https://e6938b31a5c93d7dc2f5015b4f646176@o4510500035297280.ingest.us.sentry.io/4510502317916160",

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});
export { ErrorBoundary } from "expo-router";

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

type AppState = "loading" | "unauthenticated" | "onboarding" | "authenticated";

export default Sentry.wrap(function RootLayout() {
  const [fontsLoaded, fontsError] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  const [appState, setAppState] = useState<AppState>("loading");
  const router = useRouter();

  useEffect(() => {
    if (fontsError) throw fontsError;
    if (fontsLoaded) {
      (async () => {
        const isAuthenticated = await tokenStorage.isAuthenticated();
        if (!isAuthenticated) {
          setAppState("unauthenticated");
        } else {
          const hasCompletedOnboarding = await onboardingStorage.isCompleted();
          setAppState(hasCompletedOnboarding ? "authenticated" : "onboarding");
        }
        SplashScreen.hideAsync();
      })();
    }
  }, [fontsLoaded, fontsError]);

  useEffect(() => {
    if (appState === "loading") return;

    switch (appState) {
      case "unauthenticated":
        router.replace("/(auth)/login");
        break;
      case "onboarding":
        router.replace("/onboarding");
        break;
      case "authenticated":
        router.replace("/(main)/home");
        break;
    }
  }, [appState]);

  useEffect(() => {
    setSessionExpiredHandler(async () => {
      await clearAllStorage();
      queryClient.clear();
      setAppState("unauthenticated");
    });
  }, []);

  if (!fontsLoaded || appState === "loading") return null;

  return <RootLayoutNav />;
});

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="test-crash" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(main)" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
