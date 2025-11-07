export interface User {
  id: string;
  username: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface UserProfile extends User {
  expenseCount?: number;
  totalSpent?: number;
}

export interface UpdateProfileDto {
  username?: string;
  email?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface DeleteAccountDto {
  password: string;
}
