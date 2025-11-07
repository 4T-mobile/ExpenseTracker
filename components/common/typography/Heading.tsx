import React, { ReactNode } from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { Typography, Colors } from '../../../constants/theme';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface HeadingProps {
  children: ReactNode;
  level?: HeadingLevel;
  color?: string;
  style?: TextStyle;
  center?: boolean;
}

export const Heading: React.FC<HeadingProps> = ({
  children,
  level = 'h1',
  color = Colors.textPrimary,
  style,
  center = false,
}) => {
  return (
    <Text
      style={[
        styles.base,
        styles[level],
        { color },
        center && styles.center,
        style,
      ]}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    fontWeight: Typography.fontWeight.bold,
  },
  h1: {
    fontSize: Typography.fontSize['4xl'],
    lineHeight: Typography.fontSize['4xl'] * Typography.lineHeight.tight,
  },
  h2: {
    fontSize: Typography.fontSize['3xl'],
    lineHeight: Typography.fontSize['3xl'] * Typography.lineHeight.tight,
  },
  h3: {
    fontSize: Typography.fontSize['2xl'],
    lineHeight: Typography.fontSize['2xl'] * Typography.lineHeight.tight,
  },
  h4: {
    fontSize: Typography.fontSize.xl,
    lineHeight: Typography.fontSize.xl * Typography.lineHeight.normal,
  },
  h5: {
    fontSize: Typography.fontSize.lg,
    lineHeight: Typography.fontSize.lg * Typography.lineHeight.normal,
  },
  h6: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.normal,
  },
  center: {
    textAlign: 'center',
  },
});
