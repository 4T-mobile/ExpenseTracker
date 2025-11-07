import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, View, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Screen, Container, Spacer } from '@/components/common/layout';
import { Heading, Text } from '@/components/common/typography';
import { PrimaryButton, SecondaryButton } from '@/components/common/buttons';
import { AmountInput, DateInput } from '@/components/common/inputs';
import { LoadingOverlay } from '@/components/common/feedback';
import { useCreateBudget, useUpdateBudget, useCurrentBudget } from '@/src/hooks/useBudgets';
import { CreateBudgetDto, PeriodType } from '@/src/types/budget.type';
import { parseCurrency } from '@/src/utils/currency';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';

export default function ManageBudgetScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const isEditing = params.mode === 'edit';

  const createBudgetMutation = useCreateBudget();
  const updateBudgetMutation = useUpdateBudget();
  const { data: currentBudget } = useCurrentBudget();

  const [formData, setFormData] = useState({
    amount: '',
    periodType: PeriodType.MONTHLY,
    startDate: new Date().toISOString(),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditing && currentBudget) {
      setFormData({
        amount: currentBudget.amount.toString(),
        periodType: currentBudget.periodType,
        startDate: currentBudget.startDate,
      });
    }
  }, [isEditing, currentBudget]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || parseCurrency(formData.amount) <= 0) {
      newErrors.amount = 'Budget amount must be greater than 0.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors in the form.');
      return;
    }

    try {
      const dto: CreateBudgetDto = {
        amount: parseCurrency(formData.amount),
        periodType: formData.periodType,
        startDate: formData.startDate,
      };

      if (isEditing && currentBudget) {
        await updateBudgetMutation.mutateAsync({
          id: currentBudget.id,
          dto: {
            amount: dto.amount,
            periodType: dto.periodType,
            startDate: dto.startDate,
          },
        });
      } else {
        await createBudgetMutation.mutateAsync(dto);
      }

      router.replace('/(main)/budget' as any);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        `Failed to ${isEditing ? 'update' : 'create'} budget. Please try again.`;
      Alert.alert('Error', errorMessage);
    }
  };

  const mutation = isEditing ? updateBudgetMutation : createBudgetMutation;

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Container>
            <Spacer size={16} />
            <Heading level="h2">{isEditing ? 'Edit Budget' : 'Create Budget'}</Heading>
            <Spacer size={24} />

            <AmountInput
              label="Budget Amount"
              value={formData.amount}
              onChangeText={(value) => {
                setFormData({ ...formData, amount: value });
                if (errors.amount) {
                  setErrors({ ...errors, amount: '' });
                }
              }}
              error={errors.amount}
            />

            <Text weight="medium" style={styles.label}>
              Budget Period
            </Text>
            <Spacer size={8} />
            <View style={styles.periodContainer}>
              <TouchableOpacity
                style={[
                  styles.periodButton,
                  formData.periodType === PeriodType.WEEKLY && styles.periodButtonActive,
                ]}
                onPress={() => setFormData({ ...formData, periodType: PeriodType.WEEKLY })}
              >
                <Text
                  weight="semibold"
                  style={
                    formData.periodType === PeriodType.WEEKLY
                      ? styles.periodButtonTextActive
                      : styles.periodButtonText
                  }
                >
                  Weekly
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.periodButton,
                  formData.periodType === PeriodType.MONTHLY && styles.periodButtonActive,
                ]}
                onPress={() => setFormData({ ...formData, periodType: PeriodType.MONTHLY })}
              >
                <Text
                  weight="semibold"
                  style={
                    formData.periodType === PeriodType.MONTHLY
                      ? styles.periodButtonTextActive
                      : styles.periodButtonText
                  }
                >
                  Monthly
                </Text>
              </TouchableOpacity>
            </View>
            <Spacer size={16} />

            <DateInput
              label="Start Date"
              value={new Date(formData.startDate)}
              onChangeDate={(date) => {
                setFormData({ ...formData, startDate: date.toISOString() });
              }}
            />

            <Spacer size={24} />

            <PrimaryButton
              title={isEditing ? 'Update Budget' : 'Create Budget'}
              onPress={handleSubmit}
              loading={mutation.isPending}
              disabled={mutation.isPending}
              fullWidth
            />

            <Spacer size={12} />

            <SecondaryButton
              title="Cancel"
              onPress={() => router.back()}
              disabled={mutation.isPending}
              fullWidth
            />

            <Spacer size={80} />
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <LoadingOverlay
        visible={mutation.isPending}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  periodContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  periodButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  periodButtonText: {
    color: Colors.textPrimary,
  },
  periodButtonTextActive: {
    color: Colors.white,
  },
});
