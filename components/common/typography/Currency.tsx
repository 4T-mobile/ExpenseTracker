import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { Typography, Colors } from '../../../constants/theme';
import { formatCurrency } from '../../../src/utils/currency';

interface CurrencyProps {
  amount: number;
  style?: TextStyle;
  size?: 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  color?: string;
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  showSign?: boolean;
}

export const Currency: React.FC<CurrencyProps> = ({
  amount,
  style,
  size = 'base',
  color = Colors.textPrimary,
  weight = 'semibold',
  showSign = false,
}) => {
  const formattedAmount = formatCurrency(Math.abs(amount));
  const sign = showSign ? (amount >= 0 ? '+' : '-') : '';
  const displayColor = showSign
    ? amount >= 0
      ? Colors.success
      : Colors.danger
    : color;

  return (
    <Text
      style={[
        styles.base,
        {
          fontSize: Typography.fontSize[size],
          fontWeight: Typography.fontWeight[weight],
          color: displayColor,
        },
        style,
      ]}
    >
      {sign}{formattedAmount}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    lineHeight: Typography.fontSize.base * Typography.lineHeight.normal,
  },
});
