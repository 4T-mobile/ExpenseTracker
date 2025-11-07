import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Screen, Container, Spacer } from '@/components/common/layout';
import { Heading } from '@/components/common/typography';
import { PrimaryButton, SecondaryButton } from '@/components/common/buttons';
import { TextInput, AmountInput, DateInput, TextArea, Select, SelectOption } from '@/components/common/inputs';
import { LoadingOverlay, Toast } from '@/components/common/feedback';
import { useExpense, useUpdateExpense } from '@/src/hooks/useExpenses';
import { useCategories } from '@/src/hooks/useCategories';
import { UpdateExpenseDto } from '@/src/types/expense.type';
import { parseCurrency, formatAmountInput } from '@/src/utils/currency';
import { Colors } from '@/constants/theme';

export default function EditExpenseScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const expenseId = params.id as string;

  const { data: expense, isLoading: expenseLoading } = useExpense(expenseId);
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const updateExpenseMutation = useUpdateExpense();

  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    categoryId: '',
    date: new Date().toISOString(),
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{
    visible: boolean;
    type: 'success' | 'error';
    message: string;
  }>({
    visible: false,
    type: 'success',
    message: '',
  });

  useEffect(() => {
    if (expense) {
      setFormData({
        name: expense.name,
        amount: formatAmountInput(expense.amount.toString()),
        categoryId: expense.category.id,
        date: expense.date,
        notes: expense.notes || '',
      });
    }
  }, [expense]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Expense name is required.';
    }

    if (!formData.amount || parseCurrency(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0.';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Please select a category.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setToast({
        visible: true,
        type: 'error',
        message: 'Please fix the errors in the form.',
      });
      return;
    }

    try {
      const dto: UpdateExpenseDto = {
        name: formData.name.trim(),
        amount: parseCurrency(formData.amount),
        categoryId: formData.categoryId,
        date: formData.date,
        notes: formData.notes.trim() || undefined,
      };

      await updateExpenseMutation.mutateAsync({ id: expenseId, dto });

      setToast({
        visible: true,
        type: 'success',
        message: 'Expense updated successfully!',
      });

      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update expense. Please try again.';
      setToast({
        visible: true,
        type: 'error',
        message: errorMessage,
      });
    }
  };

  const categoryOptions: SelectOption[] = categories?.map((cat) => ({
    label: cat.name,
    value: cat.id,
    icon: cat.icon,
    color: cat.color,
  })) || [];

  if (expenseLoading || categoriesLoading) {
    return (
      <Screen>
        <LoadingOverlay visible={true} />
      </Screen>
    );
  }

  if (!expense) {
    return (
      <Screen>
        <Container>
          <Spacer size={16} />
          <Heading level="h3">Expense Not Found</Heading>
          <Spacer size={16} />
          <SecondaryButton
            title="Go Back"
            onPress={() => router.back()}
            fullWidth
          />
        </Container>
      </Screen>
    );
  }

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
            <Heading level="h2">Edit Expense</Heading>
            <Spacer size={24} />

            <TextInput
              label="Expense Name"
              placeholder="e.g., Grocery shopping"
              value={formData.name}
              onChangeText={(text) => {
                setFormData({ ...formData, name: text });
                if (errors.name) {
                  setErrors({ ...errors, name: '' });
                }
              }}
              error={errors.name}
              autoCapitalize="words"
            />

            <AmountInput
              label="Amount"
              value={formData.amount}
              onChangeText={(value) => {
                setFormData({ ...formData, amount: value });
                if (errors.amount) {
                  setErrors({ ...errors, amount: '' });
                }
              }}
              error={errors.amount}
            />

            <Select
              label="Category"
              placeholder="Select a category"
              value={formData.categoryId}
              options={categoryOptions}
              onValueChange={(value) => {
                setFormData({ ...formData, categoryId: value });
                if (errors.categoryId) {
                  setErrors({ ...errors, categoryId: '' });
                }
              }}
              error={errors.categoryId}
            />

            <DateInput
              label="Date"
              value={new Date(formData.date)}
              onChangeDate={(date) => {
                setFormData({ ...formData, date: date.toISOString() });
              }}
            />

            <TextArea
              label="Notes (Optional)"
              placeholder="Add any additional notes..."
              value={formData.notes}
              onChangeText={(text) => {
                setFormData({ ...formData, notes: text });
              }}
              maxLength={500}
            />

            <Spacer size={24} />

            <PrimaryButton
              title="Update Expense"
              onPress={handleSubmit}
              loading={updateExpenseMutation.isPending}
              disabled={updateExpenseMutation.isPending}
              fullWidth
            />

            <Spacer size={12} />

            <SecondaryButton
              title="Cancel"
              onPress={() => router.back()}
              disabled={updateExpenseMutation.isPending}
              fullWidth
            />

            <Spacer size={80} />
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <LoadingOverlay
        visible={updateExpenseMutation.isPending}
      />

      <Toast
        visible={toast.visible}
        type={toast.type}
        message={toast.message}
        onHide={() => setToast({ ...toast, visible: false })}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
});
