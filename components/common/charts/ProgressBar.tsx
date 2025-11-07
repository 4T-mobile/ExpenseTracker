import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';

interface ProgressBarProps {
  current: number;
  total: number;
  color?: string;
  showPercentage?: boolean;
  height?: number;
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  color,
  showPercentage = true,
  height = 12,
  animated = true,
}) => {
  const percentage = Math.min((current / total) * 100, 100);
  const animatedWidth = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedWidth, {
        toValue: percentage,
        duration: 800,
        useNativeDriver: false,
      }).start();
    } else {
      animatedWidth.setValue(percentage);
    }
  }, [percentage, animated]);

  const getProgressColor = () => {
    if (color) return color;
    if (percentage >= 90) return Colors.danger;
    if (percentage >= 75) return Colors.warning;
    return Colors.success;
  };

  const widthInterpolation = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={[styles.progressBar, { height }]}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              width: widthInterpolation,
              backgroundColor: getProgressColor(),
              height,
            },
          ]}
        />
      </View>
      {showPercentage && (
        <Text style={styles.percentage}>{percentage.toFixed(0)}%</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginRight: Spacing.md,
  },
  progressFill: {
    borderRadius: BorderRadius.full,
  },
  percentage: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
    minWidth: 40,
    textAlign: 'right',
  },
});
