import React, { ReactNode } from 'react';
import { Text as RNText, StyleSheet, TextStyle } from 'react-native';
import { Typography, Colors } from '../../../constants/theme';

type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl';
type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';
type TextVariant = 'primary' | 'secondary' | 'tertiary' | 'disabled' | 'white';

interface TextProps {
  children: ReactNode;
  size?: TextSize;
  weight?: TextWeight;
  variant?: TextVariant;
  color?: string;
  style?: TextStyle;
  center?: boolean;
  numberOfLines?: number;
}

export const Text: React.FC<TextProps> = ({
  children,
  size = 'base',
  weight = 'regular',
  variant = 'primary',
  color,
  style,
  center = false,
  numberOfLines,
}) => {
  const textColor = color || variantColors[variant];

  return (
    <RNText
      style={[
        styles.base,
        { fontSize: Typography.fontSize[size] },
        { fontWeight: Typography.fontWeight[weight] },
        { color: textColor },
        center && styles.center,
        style,
      ]}
      numberOfLines={numberOfLines}
    >
      {children}
    </RNText>
  );
};

const variantColors: Record<TextVariant, string> = {
  primary: Colors.textPrimary,
  secondary: Colors.textSecondary,
  tertiary: Colors.textTertiary,
  disabled: Colors.textDisabled,
  white: Colors.textWhite,
};

const styles = StyleSheet.create({
  base: {
    lineHeight: Typography.fontSize.base * Typography.lineHeight.normal,
  },
  center: {
    textAlign: 'center',
  },
});
