import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Layout } from '@/constants/theme';

const isEmoji = (str: string): boolean => {
  if (!str || str.length === 0) return false;
  const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2300}-\u{23FF}]|[\u{2B50}]|[\u{200D}]|[\u{FE0F}]/u;
  return emojiRegex.test(str);
};

export interface SelectOption<T = any> {
  label: string;
  value: T;
  icon?: string;
  color?: string;
}

interface SelectProps<T = any> {
  label?: string;
  placeholder?: string;
  value?: T;
  options: SelectOption<T>[];
  onValueChange: (value: T) => void;
  error?: string;
  disabled?: boolean;
  renderOption?: (option: SelectOption<T>) => React.ReactNode;
}

export const Select = <T,>({
  label,
  placeholder = 'Select an option',
  value,
  options,
  onValueChange,
  error,
  disabled = false,
  renderOption,
}: SelectProps<T>) => {
  const [isVisible, setIsVisible] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (selectedValue: T) => {
    onValueChange(selectedValue);
    setIsVisible(false);
  };

  const defaultRenderOption = (option: SelectOption<T>) => (
    <View style={styles.optionContent}>
      {option.icon && (
        <View
          style={[
            styles.optionIconContainer,
            { backgroundColor: option.color || Colors.backgroundSecondary },
          ]}
        >
          {isEmoji(option.icon) ? (
            <Text style={styles.emojiIcon}>{option.icon}</Text>
          ) : (
            <Ionicons name={option.icon as any} size={20} color={Colors.white} />
          )}
        </View>
      )}
      <Text style={styles.optionLabel}>{option.label}</Text>
      {option.value === value && (
        <Ionicons name="checkmark" size={20} color={Colors.primary} />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        style={[
          styles.selector,
          error && styles.selectorError,
          disabled && styles.selectorDisabled,
        ]}
        onPress={() => !disabled && setIsVisible(true)}
        disabled={disabled}
      >
        {selectedOption ? (
          <View style={styles.selectedContent}>
            {selectedOption.icon && (
              <View
                style={[
                  styles.selectedIconContainer,
                  { backgroundColor: selectedOption.color || Colors.backgroundSecondary },
                ]}
              >
                {isEmoji(selectedOption.icon) ? (
                  <Text style={styles.selectedEmojiIcon}>{selectedOption.icon}</Text>
                ) : (
                  <Ionicons
                    name={selectedOption.icon as any}
                    size={18}
                    color={Colors.white}
                  />
                )}
              </View>
            )}
            <Text style={styles.selectedText}>{selectedOption.label}</Text>
          </View>
        ) : (
          <Text style={styles.placeholder}>{placeholder}</Text>
        )}
        <Ionicons
          name="chevron-down"
          size={20}
          color={disabled ? Colors.textTertiary : Colors.textSecondary}
        />
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={isVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label || 'Select'}</Text>
              <TouchableOpacity onPress={() => setIsVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={options}
              keyExtractor={(item, index) => `${item.value}-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    item.value === value && styles.optionSelected,
                  ]}
                  onPress={() => handleSelect(item.value)}
                >
                  {renderOption ? renderOption(item) : defaultRenderOption(item)}
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    height: Layout.inputHeight,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.white,
  },
  selectorError: {
    borderColor: Colors.danger,
  },
  selectorDisabled: {
    backgroundColor: Colors.backgroundSecondary,
  },
  selectedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectedIconContainer: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  selectedText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textPrimary,
    flex: 1,
  },
  placeholder: {
    fontSize: Typography.fontSize.base,
    color: Colors.textTertiary,
    flex: 1,
  },
  errorText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.danger,
    marginTop: Spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '70%',
    paddingBottom: Spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
  },
  option: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.backgroundSecondary,
  },
  optionSelected: {
    backgroundColor: Colors.backgroundSecondary,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  optionLabel: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.textPrimary,
  },
  emojiIcon: {
    fontSize: 18,
  },
  selectedEmojiIcon: {
    fontSize: 16,
  },
});
