import { z } from 'zod';
import { PeriodType } from '../types/budget.type';

export const CreateBudgetSchema = z.object({
  amount: z
    .number({ required_error: 'Budget amount is required.' })
    .positive('Budget amount must be greater than 0.')
    .max(999999999, 'Budget amount is too large.'),
  periodType: z.nativeEnum(PeriodType, {
    required_error: 'Period type is required.',
  }),
  startDate: z.string().min(1, 'Start date is required.'),
  endDate: z.string().optional(),
});

export const UpdateBudgetSchema = z.object({
  amount: z
    .number()
    .positive('Budget amount must be greater than 0.')
    .max(999999999, 'Budget amount is too large.')
    .optional(),
  periodType: z.nativeEnum(PeriodType).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type CreateBudgetFormData = z.infer<typeof CreateBudgetSchema>;
export type UpdateBudgetFormData = z.infer<typeof UpdateBudgetSchema>;
