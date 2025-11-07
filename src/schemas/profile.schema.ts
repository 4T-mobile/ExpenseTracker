import { z } from 'zod';
import { isValidEmail } from '../utils/validation';

export const UpdateProfileSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters.')
    .max(50, 'Username must not exceed 50 characters.')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers, and underscores.'
    )
    .optional(),
  email: z
    .string()
    .min(1, 'Email is required.')
    .refine((val) => isValidEmail(val), 'Invalid email format.')
    .optional(),
});

export const ChangePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, 'Current password is required.'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters.')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
      .regex(/[0-9]/, 'Password must contain at least one number.')
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        'Password must contain at least one special character.'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password.',
    path: ['newPassword'],
  });

export const DeleteAccountSchema = z.object({
  password: z.string().min(1, 'Password is required to delete account.'),
});

export type UpdateProfileFormData = z.infer<typeof UpdateProfileSchema>;
export type ChangePasswordFormData = z.infer<typeof ChangePasswordSchema>;
export type DeleteAccountFormData = z.infer<typeof DeleteAccountSchema>;
