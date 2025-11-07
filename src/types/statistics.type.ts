import { Expense } from './expense.type';
import { BudgetStatus } from './budget.type';

export interface DashboardStats {
  todayTotal: number;
  weekTotal: number;
  monthTotal: number;
  averageDailySpending: number;
  budgetStatus?: {
    budgetId: string;
    amount: number;
    spent: number;
    remaining: number;
    percentage: number;
    daysRemaining: number;
  };
  topCategories: CategoryStat[];
  recentExpenses: Expense[];
}

export interface CategoryStat {
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  total: number;
  count: number;
  percentage: number;
}

export interface DailyStat {
  date: string;
  totalAmount: number;
  expenseCount: number;
}

export interface MonthlyStat {
  month: string;
  year: number;
  totalAmount: number;
  expenseCount: number;
  averageDaily: number;
}

export interface DateRangeStats {
  startDate: string;
  endDate: string;
  totalAmount: number;
  expenseCount: number;
  dailyStats: DailyStat[];
  categoryStats: CategoryStat[];
}
