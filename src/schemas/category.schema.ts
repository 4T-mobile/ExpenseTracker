import { z } from 'zod';
import { isValidHexColor } from '../utils/validation';

export const CreateCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required.')
    .max(50, 'Category name must not exceed 50 characters.'),
  icon: z
    .string()
    .min(1, 'Category icon is required.')
    .max(10, 'Category icon must not exceed 10 characters.'),
  color: z
    .string()
    .min(1, 'Category color is required.')
    .refine((val) => isValidHexColor(val), 'Invalid color format. Use hex color code (e.g., #FF0000).'),
});

export const UpdateCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required.')
    .max(50, 'Category name must not exceed 50 characters.')
    .optional(),
  icon: z
    .string()
    .min(1, 'Category icon is required.')
    .max(10, 'Category icon must not exceed 10 characters.')
    .optional(),
  color: z
    .string()
    .min(1, 'Category color is required.')
    .refine((val) => isValidHexColor(val), 'Invalid color format. Use hex color code (e.g., #FF0000).')
    .optional(),
});

export type CreateCategoryFormData = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryFormData = z.infer<typeof UpdateCategorySchema>;
