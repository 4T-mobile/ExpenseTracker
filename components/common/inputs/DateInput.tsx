import React, { useState } from 'react';
import { TouchableOpacity, Platform, Modal, View, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from './TextInput';
import { PrimaryButton, SecondaryButton } from '../buttons';
import { formatDate } from '@/src/utils/date';
import { Colors, Spacing } from '@/constants/theme';

interface DateInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  value?: Date;
  onChangeDate?: (date: Date) => void;
  placeholder?: string;
  containerStyle?: any;
  editable?: boolean;
  minimumDate?: Date;
  maximumDate?: Date;
}

export const DateInput: React.FC<DateInputProps> = ({
  label = 'Date',
  error,
  helperText,
  value,
  onChangeDate,
  placeholder = 'Select date',
  containerStyle,
  editable = true,
  minimumDate,
  maximumDate,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(value || new Date());

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
      if (selectedDate) {
        onChangeDate?.(selectedDate);
      }
    } else {
      if (selectedDate) {
        setTempDate(selectedDate);
      }
    }
  };

  const handleConfirm = () => {
    onChangeDate?.(tempDate);
    setShowPicker(false);
  };

  const handleCancel = () => {
    setTempDate(value || new Date());
    setShowPicker(false);
  };

  const handlePress = () => {
    if (editable) {
      setTempDate(value || new Date());
      setShowPicker(true);
    }
  };

  const displayValue = value ? formatDate(value) : '';

  return (
    <>
      <TouchableOpacity
        onPress={handlePress}
        disabled={!editable}
        activeOpacity={0.7}
      >
        <View pointerEvents="none">
          <TextInput
            label={label}
            error={error}
            helperText={helperText}
            value={displayValue}
            placeholder={placeholder}
            containerStyle={containerStyle}
            editable={false}
            rightIcon={
              <Ionicons
                name="calendar-outline"
                size={22}
                color={Colors.textSecondary}
              />
            }
          />
        </View>
      </TouchableOpacity>

      {Platform.OS === 'ios' ? (
        <Modal
          visible={showPicker}
          transparent
          animationType="slide"
          onRequestClose={handleCancel}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
                style={styles.picker}
              />
              <View style={styles.buttonContainer}>
                <SecondaryButton
                  title="Cancel"
                  onPress={handleCancel}
                  style={styles.button}
                />
                <PrimaryButton
                  title="Confirm"
                  onPress={handleConfirm}
                  style={styles.button}
                />
              </View>
            </View>
          </View>
        </Modal>
      ) : (
        showPicker && (
          <DateTimePicker
            value={value || new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
          />
        )
      )}
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  picker: {
    width: '100%',
    height: 200,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  button: {
    flex: 1,
  },
});
