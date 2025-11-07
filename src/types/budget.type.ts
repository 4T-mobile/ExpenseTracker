export enum PeriodType {
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

export interface Budget {
  id: string;
  amount: number;
  periodType: PeriodType;
  startDate: string;
  endDate: string;
  isActive: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBudgetDto {
  amount: number;
  periodType: PeriodType;
  startDate: string;
  endDate?: string;
}

export interface UpdateBudgetDto {
  amount?: number;
  periodType?: PeriodType;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

export interface BudgetStatus extends Budget {
  spentAmount: number;
  remainingAmount: number;
  percentage: number;
  daysRemaining: number;
  isOverBudget: boolean;
}

export interface BudgetWithExpenses extends Budget {
  expenses: {
    id: string;
    amount: number;
  }[];
  totalSpent: number;
}
