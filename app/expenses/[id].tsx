import React from 'react';
import { StyleSheet, ScrollView, View, Alert, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Container, Spacer } from '@/components/common/layout';
import { Heading, Text, Currency } from '@/components/common/typography';
import { Card } from '@/components/common/cards';
import { PrimaryButton, SecondaryButton } from '@/components/common/buttons';
import { LoadingOverlay } from '@/components/common/feedback';
import { useExpense, useDeleteExpense } from '@/src/hooks/useExpenses';
import { formatDate } from '@/src/utils/date';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';

export default function ExpenseDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const expenseId = params.id as string;

  const { data: expense, isLoading } = useExpense(expenseId);
  const deleteExpenseMutation = useDeleteExpense();

  const handleDelete = () => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteExpenseMutation.mutateAsync(expenseId);
              router.back();
            } catch (error: any) {
              const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                'Failed to delete expense. Please try again.';
              Alert.alert('Error', errorMessage);
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
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
          <Text>The expense you are looking for does not exist or has been deleted.</Text>
          <Spacer size={24} />
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <Container>
          <Spacer size={16} />

          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
            <Heading level="h2" style={styles.headerTitle}>Expense Details</Heading>
            <View style={styles.backButton} />
          </View>

          <Spacer size={24} />

          <Card style={styles.amountCard}>
            <View style={styles.amountContainer}>
              <Text style={styles.amountLabel}>Total Amount</Text>
              <Currency amount={expense.amount} size="2xl" weight="bold" />
            </View>
          </Card>

          <Spacer size={16} />

          <Card>
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Expense Name</Text>
              <Text style={styles.sectionValue}>{expense.name}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Category</Text>
              <View style={styles.categoryRow}>
                <View
                  style={[
                    styles.categoryIcon,
                    { backgroundColor: `${expense.category.color}20` },
                  ]}
                >
                  <Text style={styles.categoryEmoji}>{expense.category.icon}</Text>
                </View>
                <Text style={styles.categoryName}>{expense.category.name}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Date</Text>
              <View style={styles.dateRow}>
                <Ionicons name="calendar-outline" size={18} color={Colors.primary} />
                <Text style={styles.dateText}>{formatDate(new Date(expense.date))}</Text>
              </View>
            </View>

            {expense.notes && (
              <>
                <View style={styles.divider} />
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Notes</Text>
                  <Text style={styles.notesText}>{expense.notes}</Text>
                </View>
              </>
            )}
          </Card>

          <Spacer size={16} />

          <Card>
            <View style={styles.metaSection}>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Created</Text>
                <Text style={styles.metaValue}>
                  {formatDate(new Date(expense.createdAt))}
                </Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Last Updated</Text>
                <Text style={styles.metaValue}>
                  {formatDate(new Date(expense.updatedAt))}
                </Text>
              </View>
            </View>
          </Card>

          <Spacer size={24} />

          <PrimaryButton
            title="Edit Expense"
            onPress={() => router.push(`/edit-expense?id=${expenseId}` as any)}
            disabled={deleteExpenseMutation.isPending}
            fullWidth
          />

          <Spacer size={12} />

          <SecondaryButton
            title="Delete Expense"
            onPress={handleDelete}
            loading={deleteExpenseMutation.isPending}
            disabled={deleteExpenseMutation.isPending}
            fullWidth
            variant="danger"
          />

          <Spacer size={12} />

          <SecondaryButton
            title="Go Back"
            onPress={() => router.back()}
            disabled={deleteExpenseMutation.isPending}
            fullWidth
          />

          <Spacer size={80} />
        </Container>
      </ScrollView>

      <LoadingOverlay visible={deleteExpenseMutation.isPending} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  amountCard: {
    backgroundColor: Colors.primary,
  },
  amountContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  amountLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.white,
    marginBottom: Spacing.xs,
    opacity: 0.9,
  },
  section: {
    paddingVertical: Spacing.md,
  },
  sectionLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  sectionValue: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  categoryEmoji: {
    fontSize: 20,
  },
  categoryName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
    marginLeft: Spacing.sm,
  },
  notesText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  metaSection: {
    paddingVertical: Spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  metaLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  metaValue: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textTertiary,
  },
});
