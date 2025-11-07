import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Screen, Container, Spacer } from '@/components/common/layout';
import { Heading } from '@/components/common/typography';
import { ExpenseCard } from '@/components/common/cards';
import { FloatingActionButton } from '@/components/common/buttons';
import { LoadingSpinner, EmptyState } from '@/components/common/feedback';
import { useExpenses } from '@/src/hooks/useExpenses';

export default function ExpensesScreen() {
  const router = useRouter();
  const { data, isLoading, refetch, isRefetching, error, isError } = useExpenses({
    page: 1,
    limit: 20,
    sortBy: 'date',
    order: 'desc',
  });

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch])
  );

  const handleAddExpense = () => {
    router.push('/add-expense' as any);
  };

  if (isLoading) {
    return (
      <Screen>
        <LoadingSpinner text="Loading expenses..." />
      </Screen>
    );
  }

  if (isError) {
    const errorMessage = (error as any)?.response?.data?.message || (error as any)?.message || 'Failed to load expenses.';
    return (
      <Screen>
        <Container style={styles.centerContainer}>
          <EmptyState
            icon="alert-circle-outline"
            title="Error Loading Expenses"
            message={errorMessage}
            actionLabel="Try Again"
            onAction={() => refetch()}
          />
        </Container>
      </Screen>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <Screen>
        <Container>
          <EmptyState
            icon="receipt-outline"
            title="No Expenses"
            message="Start tracking your expenses by adding your first expense."
            actionLabel="Add Expense"
            onAction={handleAddExpense}
          />
        </Container>
        <FloatingActionButton onPress={handleAddExpense} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Container style={styles.container}>
        <Spacer size={16} />
        <Heading level="h2">Expenses</Heading>
        <Spacer size={16} />

        <FlatList
          data={data.data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ExpenseCard
              id={item.id}
              name={item.name}
              amount={item.amount}
              category={item.category}
              date={new Date(item.date)}
              notes={item.notes}
              onPress={() => router.push(`/expenses/${item.id}` as any)}
            />
          )}
          onRefresh={refetch}
          refreshing={isRefetching}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </Container>

      <FloatingActionButton onPress={handleAddExpense} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  listContent: {
    paddingBottom: 80,
  },
});
