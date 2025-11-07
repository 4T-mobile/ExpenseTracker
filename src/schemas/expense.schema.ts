import { z } from 'zod';

export const CreateExpenseSchema = z.object({
  name: z
    .string()
    .min(1, 'Expense name is required.')
    .max(255, 'Expense name must not exceed 255 characters.'),
  amount: z
    .number({ required_error: 'Amount is required.' })
    .positive('Amount must be greater than 0.')
    .max(999999999, 'Amount is too large.'),
  categoryId: z
    .string()
    .uuid('Invalid category.')
    .min(1, 'Category is required.'),
  date: z.string().optional(),
  notes: z
    .string()
    .max(1000, 'Notes must not exceed 1000 characters.')
    .optional(),
});

export const UpdateExpenseSchema = z.object({
  name: z
    .string()
    .min(1, 'Expense name is required.')
    .max(255, 'Expense name must not exceed 255 characters.')
    .optional(),
  amount: z
    .number()
    .positive('Amount must be greater than 0.')
    .max(999999999, 'Amount is too large.')
    .optional(),
  categoryId: z.string().uuid('Invalid category.').optional(),
  date: z.string().optional(),
  notes: z
    .string()
    .max(1000, 'Notes must not exceed 1000 characters.')
    .optional(),
});

export const ExpenseFilterSchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
  sortBy: z.enum(['date', 'amount', 'name', 'createdAt']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
  categoryId: z.string().uuid().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  minAmount: z.number().positive().optional(),
  maxAmount: z.number().positive().optional(),
  search: z.string().optional(),
});

export type CreateExpenseFormData = z.infer<typeof CreateExpenseSchema>;
export type UpdateExpenseFormData = z.infer<typeof UpdateExpenseSchema>;
export type ExpenseFilterFormData = z.infer<typeof ExpenseFilterSchema>;
