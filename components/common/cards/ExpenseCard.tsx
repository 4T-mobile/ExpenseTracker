import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from './Card';
import { Currency } from '../typography';
import { formatRelativeTime } from '@/src/utils/date';
import { Colors, Typography, Spacing } from '@/constants/theme';

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface ExpenseCardProps {
  id: string;
  name: string;
  amount: number;
  category: Category;
  date: Date;
  notes?: string;
  onPress?: () => void;
  onDelete?: () => void;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({
  name,
  amount,
  category,
  date,
  notes,
  onPress,
  onDelete,
}) => {
  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.container}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: `${category.color}20` },
          ]}
        >
          <Text style={styles.icon}>{category.icon}</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
            <Currency amount={amount} size="base" weight="semibold" />
          </View>

          <View style={styles.footer}>
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.separator}>•</Text>
              <Text style={styles.date}>{formatRelativeTime(date)}</Text>
            </View>

            {onDelete && (
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name="trash-outline"
                  size={18}
                  color={Colors.danger}
                />
              </TouchableOpacity>
            )}
          </View>

          {notes && (
            <Text style={styles.notes} numberOfLines={1}>
              {notes}
            </Text>
          )}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.sm,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  icon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  name: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
    marginRight: Spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryName: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  separator: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textTertiary,
    marginHorizontal: Spacing.xs,
  },
  date: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textTertiary,
  },
  notes: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textTertiary,
    marginTop: Spacing.xs,
  },
});
