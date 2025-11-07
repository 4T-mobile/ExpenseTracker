import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows, BorderRadius } from '@/constants/theme';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  variant?: 'primary' | 'danger';
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  icon,
  disabled = false,
  variant = 'primary',
}) => {
  const handlePress = () => {
    if (!disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress();
    }
  };

  const getBackgroundColor = () => {
    if (disabled) return Colors.disabled;
    return variant === 'danger' ? Colors.danger : Colors.primary;
  };

  return (
    <TouchableOpacity
      style={[
        styles.fab,
        { backgroundColor: getBackgroundColor() },
        disabled && styles.disabledFab,
      ]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      {icon || <Ionicons name="add" size={28} color={Colors.white} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.lg,
    elevation: 8,
  },
  disabledFab: {
    opacity: 0.6,
  },
});
