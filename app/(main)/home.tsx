import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Container, Row, Spacer } from '@/components/common/layout';
import { Heading, Text } from '@/components/common/typography';
import {
  BudgetCard,
  StatCard,
  ExpenseCard,
} from '@/components/common/cards';
import { FloatingActionButton } from '@/components/common/buttons';
import { LoadingSpinner, EmptyState } from '@/components/common/feedback';
import { useDashboard } from '@/src/hooks/useStatistics';
import { Colors, Spacing } from '@/constants/theme';

export default function HomeScreen() {
  const router = useRouter();
  const { data: dashboard, isLoading, refetch, isRefetching, error, isError } = useDashboard();

  const handleAddExpense = () => {
    router.push('/add-expense' as any);
  };

  if (isLoading) {
    return (
      <Screen>
        <LoadingSpinner text="Loading dashboard..." />
      </Screen>
    );
  }

  if (isError) {
    const errorMessage = (error as any)?.response?.data?.message || (error as any)?.message || 'Failed to load dashboard.';
    return (
      <Screen>
        <Container style={styles.centerContainer}>
          <EmptyState
            icon="alert-circle-outline"
            title="Error Loading Dashboard"
            message={errorMessage}
            actionLabel="Try Again"
            onAction={() => refetch()}
          />
        </Container>
      </Screen>
    );
  }

  if (!dashboard) {
    return (
      <Screen>
        <EmptyState
          icon="stats-chart-outline"
          title="No data available"
          message="Start tracking your expenses to see your dashboard."
          actionLabel="Add Expense"
          onAction={handleAddExpense}
        />
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
          <Heading level="h2">Dashboard</Heading>
          <Text variant="secondary">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
          <Spacer size={24} />

          {dashboard.budgetStatus && (
            <>
              <BudgetCard
                totalAmount={dashboard.budgetStatus.amount}
                spentAmount={dashboard.budgetStatus.spent}
                remainingAmount={dashboard.budgetStatus.remaining}
                percentage={dashboard.budgetStatus.percentage}
                daysRemaining={dashboard.budgetStatus.daysRemaining}
                onPress={() => router.push('/budget' as any)}
              />
              <Spacer size={24} />
            </>
          )}

          <Text weight="semibold" size="lg" style={styles.sectionTitle}>
            Quick Stats
          </Text>
          <Spacer size={12} />

          <Row gap={12} style={styles.statsRow}>
            <StatCard
              title="Today"
              amount={dashboard.todayTotal}
              icon="today-outline"
              iconColor={Colors.info}
            />
            <StatCard
              title="This Week"
              amount={dashboard.weekTotal}
              icon="calendar-outline"
              iconColor={Colors.success}
            />
          </Row>
          <Spacer size={12} />
          <Row gap={12} style={styles.statsRow}>
            <StatCard
              title="This Month"
              amount={dashboard.monthTotal}
              icon="stats-chart-outline"
              iconColor={Colors.warning}
            />
            <StatCard
              title="Average Daily"
              amount={dashboard.averageDailySpending}
              icon="trending-up-outline"
              iconColor={Colors.primary}
            />
          </Row>

          <Spacer size={24} />

          {dashboard.recentExpenses && dashboard.recentExpenses.length > 0 ? (
            <>
              <View style={styles.sectionHeader}>
                <Text weight="semibold" size="lg">
                  Recent Expenses
                </Text>
                <TouchableOpacity onPress={() => router.push('/expenses' as any)}>
                  <Text variant="primary" weight="semibold">
                    See All
                  </Text>
                </TouchableOpacity>
              </View>
              <Spacer size={12} />
              {dashboard.recentExpenses.map((expense) => (
                <ExpenseCard
                  key={expense.id}
                  id={expense.id}
                  name={expense.name}
                  amount={expense.amount}
                  category={expense.category}
                  date={new Date(expense.date)}
                  notes={expense.notes}
                  onPress={() => router.push(`/expenses/${expense.id}` as any)}
                />
              ))}
            </>
          ) : (
            <EmptyState
              icon="receipt-outline"
              title="No expenses yet"
              message="Start tracking your spending by adding your first expense."
              actionLabel="Add Expense"
              onAction={handleAddExpense}
            />
          )}

          <Spacer size={80} />
        </Container>
      </ScrollView>

      <FloatingActionButton onPress={handleAddExpense} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  sectionTitle: {
    marginBottom: Spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
  },
});
