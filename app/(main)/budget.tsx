import React from 'react';
import { StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Container, Spacer } from '@/components/common/layout';
import { Heading } from '@/components/common/typography';
import { BudgetCard } from '@/components/common/cards';
import { PrimaryButton } from '@/components/common/buttons';
import { LoadingSpinner, EmptyState } from '@/components/common/feedback';
import { useCurrentBudget } from '@/src/hooks/useBudgets';
import { Colors } from '@/constants/theme';

export default function BudgetScreen() {
  const router = useRouter();
  const { data: budget, isLoading, refetch, isRefetching, error, isError } = useCurrentBudget();

  if (isLoading) {
    return (
      <Screen>
        <LoadingSpinner text="Loading budget..." />
      </Screen>
    );
  }

  if (isError) {
    const errorMessage = (error as any)?.response?.data?.message || (error as any)?.message || 'Failed to load budget.';
    return (
      <Screen>
        <Container style={styles.centerContainer}>
          <EmptyState
            icon="alert-circle-outline"
            title="Error Loading Budget"
            message={errorMessage}
            actionLabel="Try Again"
            onAction={() => refetch()}
          />
        </Container>
      </Screen>
    );
  }

  if (!budget) {
    return (
      <Screen>
        <Container>
          <EmptyState
            icon="wallet-outline"
            title="No Active Budget"
            message="Create a budget to track your spending and stay within your financial goals."
            actionLabel="Create Budget"
            onAction={() => router.push('/manage-budget' as any)}
          />
        </Container>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={Colors.primary}
          />
        }
      >
        <Container>
          <Spacer size={16} />
          <Heading level="h2">Budget</Heading>
          <Spacer size={24} />

          <BudgetCard
            totalAmount={budget.amount}
            spentAmount={budget.spentAmount}
            startDate={new Date(budget.startDate)}
            endDate={new Date(budget.endDate)}
            periodType={budget.periodType}
          />

          <Spacer size={16} />

          <PrimaryButton
            title="Edit Budget"
            onPress={() => router.push('/manage-budget?mode=edit' as any)}
            fullWidth
          />

          <Spacer size={80} />
        </Container>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});
