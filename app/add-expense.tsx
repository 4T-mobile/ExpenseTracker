import React, { useState } from 'react';
import { StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Container, Spacer } from '@/components/common/layout';
import { Heading } from '@/components/common/typography';
import { PrimaryButton, SecondaryButton } from '@/components/common/buttons';
import { TextInput, AmountInput, DateInput, TextArea, Select, SelectOption } from '@/components/common/inputs';
import { LoadingOverlay } from '@/components/common/feedback';
import { useAddExpense } from '@/src/hooks/useExpenses';
import { useCategories } from '@/src/hooks/useCategories';
import { CreateExpenseDto } from '@/src/types/expense.type';
import { parseCurrency } from '@/src/utils/currency';
import { Colors } from '@/constants/theme';

export default function AddExpenseScreen() {
  const router = useRouter();
  const addExpenseMutation = useAddExpense();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    categoryId: '',
    date: new Date().toISOString(),
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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
      Alert.alert('Validation Error', 'Please fix the errors in the form.');
      return;
    }

    try {
      const dto: CreateExpenseDto = {
        name: formData.name.trim(),
        amount: parseCurrency(formData.amount),
        categoryId: formData.categoryId,
        date: formData.date,
        notes: formData.notes.trim() || undefined,
      };

      await addExpenseMutation.mutateAsync(dto);

      router.replace('/(main)/home' as any);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to add expense. Please try again.';
      Alert.alert('Error', errorMessage);
    }
  };

  const categoryOptions: SelectOption[] = categories?.map((cat) => ({
    label: cat.name,
    value: cat.id,
    icon: cat.icon,
    color: cat.color,
  })) || [];

  if (categoriesLoading) {
    return (
      <Screen>
        <LoadingOverlay visible={true} />
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
            <Heading level="h2">Add Expense</Heading>
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
              title="Add Expense"
              onPress={handleSubmit}
              loading={addExpenseMutation.isPending}
              disabled={addExpenseMutation.isPending}
              fullWidth
            />

            <Spacer size={12} />

            <SecondaryButton
              title="Cancel"
              onPress={() => router.back()}
              disabled={addExpenseMutation.isPending}
              fullWidth
            />

            <Spacer size={80} />
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <LoadingOverlay
        visible={addExpenseMutation.isPending}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
});
