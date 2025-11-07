import React, { useState } from 'react';
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
  TextInputProps as RNTextInputProps,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';

interface TextAreaProps extends Omit<RNTextInputProps, 'style' | 'multiline'> {
  label?: string;
  error?: string;
  helperText?: string;
  containerStyle?: any;
  numberOfLines?: number;
  maxLength?: number;
  showCharCount?: boolean;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  helperText,
  containerStyle,
  numberOfLines = 4,
  maxLength,
  showCharCount = false,
  value = '',
  editable = true,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getBorderColor = () => {
    if (error) return Colors.danger;
    if (isFocused) return Colors.primary;
    return Colors.border;
  };

  const charCount = value?.toString().length || 0;

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.labelRow}>
        {label && <Text style={styles.label}>{label}</Text>}
        {showCharCount && maxLength && (
          <Text style={styles.charCount}>
            {charCount}/{maxLength}
          </Text>
        )}
      </View>
      <View
        style={[
          styles.textAreaContainer,
          {
            borderColor: getBorderColor(),
            backgroundColor: editable ? Colors.white : Colors.backgroundSecondary,
          },
        ]}
      >
        <RNTextInput
          style={styles.textArea}
          placeholderTextColor={Colors.textTertiary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          multiline
          numberOfLines={numberOfLines}
          textAlignVertical="top"
          value={value}
          maxLength={maxLength}
          editable={editable}
          {...textInputProps}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {helperText && !error && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  label: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
  },
  charCount: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textTertiary,
  },
  textAreaContainer: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  textArea: {
    fontSize: Typography.fontSize.base,
    color: Colors.textPrimary,
    minHeight: 80,
    padding: 0,
  },
  errorText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.danger,
    marginTop: Spacing.xs,
  },
  helperText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textTertiary,
    marginTop: Spacing.xs,
  },
});
