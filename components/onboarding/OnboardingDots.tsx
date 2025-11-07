import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';

interface OnboardingDotsProps {
  totalSteps: number;
  currentStep: number;
}

const DOT_SIZE = 8;
const ACTIVE_DOT_WIDTH = 24;

export const OnboardingDots: React.FC<OnboardingDotsProps> = ({
  totalSteps,
  currentStep,
}) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <Dot key={index} index={index} currentStep={currentStep} />
      ))}
    </View>
  );
};

interface DotProps {
  index: number;
  currentStep: number;
}

const Dot: React.FC<DotProps> = ({ index, currentStep }) => {
  const isActive = index === currentStep;

  const animatedStyle = useAnimatedStyle(() => {
    const width = withSpring(isActive ? ACTIVE_DOT_WIDTH : DOT_SIZE, {
      damping: 15,
      stiffness: 150,
    });

    const opacity = withSpring(
      interpolate(Math.abs(currentStep - index), [0, 1, 2], [1, 0.5, 0.3]),
      { damping: 15, stiffness: 150 }
    );

    return {
      width,
      opacity,
      backgroundColor: isActive ? Colors.primary : Colors.border,
    };
  }, [isActive, currentStep, index]);

  return <Animated.View style={[styles.dot, animatedStyle]} />;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  dot: {
    height: DOT_SIZE,
    borderRadius: BorderRadius.full,
  },
});
