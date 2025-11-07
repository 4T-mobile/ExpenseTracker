import { Category } from './category.type';
import { PaginatedResponse, PaginationParams, SortParams, DateRangeFilter } from './common.type';

export interface Expense {
  id: string;
  name: string;
  amount: number;
  date: string;
  notes?: string;
  category: Category;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseDto {
  name: string;
  amount: number;
  categoryId: string;
  date?: string;
  notes?: string;
}

export interface UpdateExpenseDto {
  name?: string;
  amount?: number;
  categoryId?: string;
  date?: string;
  notes?: string;
}

export interface ExpenseQuery extends PaginationParams, SortParams, DateRangeFilter {
  categoryId?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}

export type PaginatedExpenses = PaginatedResponse<Expense>;

export interface ExpenseGroupByDate {
  date: string;
  label: string;
  expenses: Expense[];
  totalAmount: number;
}
