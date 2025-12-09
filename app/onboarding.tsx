import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ViewToken,
} from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Spacing, Typography } from "@/constants/theme";
import { PrimaryButton } from "@/components/common/buttons/PrimaryButton";
import { Text } from "@/components/common/typography/Text";
import {
  OnboardingSlide,
  OnboardingSlideData,
  OnboardingDots,
} from "@/components/onboarding";
import { onboardingStorage } from "@/src/utils/onboardingStorage";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const ONBOARDING_SLIDES: OnboardingSlideData[] = [
  {
    id: "1",
    iconName: "receipt-outline",
    title: "Track Your Expenses",
    subtitle: "Simple & Organized",
    description:
      "Easily log your daily expenses with categories like Food, Transport, Shopping, and more. Stay on top of where your money goes.",
  },
  {
    id: "2",
    iconName: "wallet-outline",
    title: "Set Smart Budgets",
    subtitle: "Stay in Control",
    description:
      "Create weekly or monthly budgets and watch your spending progress. Get visual insights on how much you have spent vs. planned.",
  },
  {
    id: "3",
    iconName: "stats-chart-outline",
    title: "Analyze & Save",
    subtitle: "Make Better Decisions",
    description:
      "View statistics on your spending patterns - today, this week, or this month. Identify areas to save and reach your financial goals.",
  },
];

export default function OnboardingScreen({ initialStep = 0 }) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);

  const isLastStep = currentStep === ONBOARDING_SLIDES.length - 1;

  useEffect(() => {
    const loadSavedStep = async () => {
      const state = await onboardingStorage.getState();
      if (
        state.currentStep > 0 &&
        state.currentStep < ONBOARDING_SLIDES.length
      ) {
        setCurrentStep(state.currentStep);
        flatListRef.current?.scrollToIndex({
          index: state.currentStep,
          animated: false,
        });
      }
    };
    loadSavedStep();
  }, []);

  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        const newStep = viewableItems[0].index;
        setCurrentStep(newStep);
        onboardingStorage.setCurrentStep(newStep);
      }
    },
    []
  );

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleNext = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (isLastStep) {
      handleComplete();
    } else {
      const nextStep = currentStep + 1;
      flatListRef.current?.scrollToIndex({ index: nextStep, animated: true });
    }
  }, [currentStep, isLastStep]);

  const handleSkip = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    handleComplete();
  }, []);

  const handleComplete = useCallback(async () => {
    await onboardingStorage.markAsCompleted();
    router.replace("/(main)/home");
  }, [router]);

  const renderSlide = useCallback(
    ({ item }: { item: OnboardingSlideData }) => (
      <OnboardingSlide data={item} />
    ),
    []
  );

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: SCREEN_WIDTH,
      offset: SCREEN_WIDTH * index,
      index,
    }),
    []
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {!isLastStep && (
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text variant="secondary" weight="medium">
              Skip
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        ref={flatListRef}
        data={ONBOARDING_SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={getItemLayout}
        initialScrollIndex={0}
      />

      <View style={styles.footer}>
        <OnboardingDots
          totalSteps={ONBOARDING_SLIDES.length}
          currentStep={currentStep}
        />

        <View style={styles.buttonContainer}>
          <PrimaryButton
            title={isLastStep ? "Get Started" : "Next"}
            onPress={handleNext}
            fullWidth
            testID={isLastStep ? "start-btn" : "next-btn"}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    height: 48,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
  },
  skipButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  footer: {
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
    gap: Spacing.xl,
  },
  buttonContainer: {
    width: "100%",
    marginTop: Spacing.md,
  },
});
