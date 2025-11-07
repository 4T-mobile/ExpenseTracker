import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput } from './TextInput';
import { formatAmountInput, parseCurrency } from '@/src/utils/currency';
import { Colors, Typography, Spacing } from '@/constants/theme';

interface AmountInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onChangeAmount?: (amount: number) => void;
  placeholder?: string;
  containerStyle?: any;
  editable?: boolean;
}

export const AmountInput: React.FC<AmountInputProps> = ({
  label = 'Amount',
  error,
  helperText,
  value,
  onChangeText,
  onChangeAmount,
  placeholder = '0',
  containerStyle,
  editable = true,
}) => {
  const handleChangeText = (text: string) => {
    const cleanedText = text.replace(/[^\d]/g, '');

    if (cleanedText === '') {
      onChangeText?.('');
      onChangeAmount?.(0);
      return;
    }

    const formattedValue = formatAmountInput(cleanedText);
    onChangeText?.(formattedValue);

    const numericValue = parseCurrency(formattedValue);
    onChangeAmount?.(numericValue);
  };

  return (
    <TextInput
      label={label}
      error={error}
      helperText={helperText}
      value={value}
      onChangeText={handleChangeText}
      placeholder={placeholder}
      keyboardType="numeric"
      containerStyle={containerStyle}
      editable={editable}
      rightIcon={
        <View style={styles.currencySymbol}>
          <Text style={styles.currencyText}>₫</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  currencySymbol: {
    paddingLeft: Spacing.sm,
  },
  currencyText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textSecondary,
  },
});
