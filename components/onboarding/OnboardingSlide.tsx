import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { Heading } from '@/components/common/typography/Heading';
import { Text } from '@/components/common/typography/Text';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface OnboardingSlideData {
  id: string;
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  description: string;
}

interface OnboardingSlideProps {
  data: OnboardingSlideData;
}

export const OnboardingSlide: React.FC<OnboardingSlideProps> = ({ data }) => {
  const { iconName, title, subtitle, description } = data;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name={iconName} size={80} color={Colors.primary} />
        </View>

        <Heading level="h3" center style={styles.title}>
          {title}
        </Heading>

        <Text
          size="lg"
          weight="semibold"
          color={Colors.primary}
          center
          style={styles.subtitle}
        >
          {subtitle}
        </Text>

        <Text variant="secondary" center style={styles.description}>
          {description}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    marginBottom: Spacing.sm,
  },
  subtitle: {
    marginBottom: Spacing.md,
  },
  description: {
    lineHeight: Typography.fontSize.base * Typography.lineHeight.relaxed,
  },
});
