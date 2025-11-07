import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Shadows, BorderRadius } from '@/constants/theme';

interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'danger';
  withBackground?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  loading = false,
  disabled = false,
  size = 'md',
  variant = 'default',
  withBackground = false,
}) => {
  const handlePress = () => {
    if (!disabled && !loading) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case 'sm':
        return 32;
      case 'lg':
        return 48;
      default:
        return 40;
    }
  };

  const getBackgroundColor = () => {
    if (!withBackground) return 'transparent';
    if (disabled) return Colors.disabled;
    switch (variant) {
      case 'primary':
        return Colors.primary;
      case 'danger':
        return Colors.danger;
      default:
        return Colors.backgroundSecondary;
    }
  };

  const getIconColor = () => {
    if (disabled) return Colors.textTertiary;
    if (withBackground && variant !== 'default') return Colors.white;
    switch (variant) {
      case 'primary':
        return Colors.primary;
      case 'danger':
        return Colors.danger;
      default:
        return Colors.textPrimary;
    }
  };

  const buttonSize = getButtonSize();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          width: buttonSize,
          height: buttonSize,
          backgroundColor: getBackgroundColor(),
        },
        withBackground && styles.withBackground,
        disabled && styles.disabledButton,
      ]}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={getIconColor()} size="small" />
      ) : (
        icon
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
  },
  withBackground: {
    ...Shadows.sm,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
