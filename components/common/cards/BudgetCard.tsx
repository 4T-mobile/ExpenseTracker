import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { Currency } from '../typography';
import { getDaysRemaining } from '@/src/utils/date';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';

interface BudgetCardProps {
  totalAmount: number;
  spentAmount: number;
  remainingAmount?: number;
  percentage?: number;
  startDate?: Date;
  endDate?: Date;
  daysRemaining?: number;
  periodType?: 'WEEKLY' | 'MONTHLY';
  onPress?: () => void;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({
  totalAmount,
  spentAmount,
  remainingAmount: propRemainingAmount,
  percentage: propPercentage,
  endDate,
  daysRemaining: propDaysRemaining,
  periodType,
  onPress,
}) => {
  const remainingAmount = propRemainingAmount ?? totalAmount - spentAmount;
  const percentage = propPercentage ?? (spentAmount / totalAmount) * 100;
  const daysRemaining = propDaysRemaining ?? (endDate ? getDaysRemaining(endDate) : 0);

  const getProgressColor = () => {
    if (percentage >= 90) return Colors.danger;
    if (percentage >= 75) return Colors.warning;
    return Colors.success;
  };

  const getRemainingColor = () => {
    if (percentage >= 90) return Colors.danger;
    if (percentage >= 75) return Colors.warning;
    return Colors.success;
  };

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.label}>Monthly Budget</Text>
          <Currency
            amount={totalAmount}
            size="2xl"
            weight="bold"
            color={Colors.textPrimary}
          />
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {periodType === 'WEEKLY' ? 'Weekly' : 'Monthly'}
          </Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: getProgressColor(),
              },
            ]}
          />
        </View>
        <Text style={styles.percentage}>{percentage.toFixed(0)}%</Text>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Spent</Text>
          <Currency
            amount={spentAmount}
            size="lg"
            weight="semibold"
            color={Colors.textPrimary}
          />
        </View>

        <View style={styles.stat}>
          <Text style={styles.statLabel}>Remaining</Text>
          <Currency
            amount={remainingAmount}
            size="lg"
            weight="semibold"
            color={getRemainingColor()}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.daysRemaining}>
          {daysRemaining > 0
            ? `${daysRemaining} days remaining`
            : 'Budget period ended'}
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  badge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  badgeText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.white,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  progressBar: {
    flex: 1,
    height: 12,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginRight: Spacing.md,
  },
  progressFill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  percentage: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
    minWidth: 40,
    textAlign: 'right',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  stat: {
    flex: 1,
  },
  statLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  footer: {
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  daysRemaining: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
