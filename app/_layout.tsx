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
export { ErrorBoundary } from "expo-router";

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

type AppState = 'loading' | 'unauthenticated' | 'onboarding' | 'authenticated';

export default function RootLayout() {
  const [fontsLoaded, fontsError] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  const [appState, setAppState] = useState<AppState>('loading');
  const router = useRouter();

  useEffect(() => {
    if (fontsError) throw fontsError;
    if (fontsLoaded) {
      (async () => {
        const isAuthenticated = await tokenStorage.isAuthenticated();
        if (!isAuthenticated) {
          setAppState('unauthenticated');
        } else {
          const hasCompletedOnboarding = await onboardingStorage.isCompleted();
          setAppState(hasCompletedOnboarding ? 'authenticated' : 'onboarding');
        }
        SplashScreen.hideAsync();
      })();
    }
  }, [fontsLoaded, fontsError]);

  useEffect(() => {
    if (appState === 'loading') return;

    switch (appState) {
      case 'unauthenticated':
        router.replace("/(auth)/login");
        break;
      case 'onboarding':
        router.replace("/onboarding");
        break;
      case 'authenticated':
        router.replace("/(main)/home");
        break;
    }
  }, [appState]);

  useEffect(() => {
    setSessionExpiredHandler(async () => {
      await clearAllStorage();
      queryClient.clear();
      setAppState('unauthenticated');
    });
  }, []);

  if (!fontsLoaded || appState === 'loading') return null;

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
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
