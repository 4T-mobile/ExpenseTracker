import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { Currency } from '../typography';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';

interface CategoryCardProps {
  id: string;
  name: string;
  icon: string;
  color: string;
  totalAmount?: number;
  expenseCount?: number;
  onPress?: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  name,
  icon,
  color,
  totalAmount,
  expenseCount,
  onPress,
}) => {
  return (
    <Card onPress={onPress} variant="outlined" style={styles.card}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: `${color}20`, borderColor: color },
        ]}
      >
        <Text style={styles.icon}>{icon}</Text>
      </View>

      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>

      {totalAmount !== undefined && (
        <View style={styles.stats}>
          <Currency
            amount={totalAmount}
            size="sm"
            weight="semibold"
            color={Colors.textPrimary}
          />
          {expenseCount !== undefined && expenseCount > 0 && (
            <Text style={styles.count}>
              {expenseCount} {expenseCount === 1 ? 'expense' : 'expenses'}
            </Text>
          )}
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    marginBottom: Spacing.sm,
  },
  icon: {
    fontSize: 28,
  },
  name: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  stats: {
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  count: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textTertiary,
    marginTop: 2,
  },
});
