import { apiClient } from './client';
import {
  UserProfile,
  UpdateProfileDto,
  ChangePasswordDto,
  DeleteAccountDto,
} from '../types/user.type';
import { ApiResponse } from '../types/common.type';

export const usersApi = {
  getProfile: async (): Promise<UserProfile> => {
    const { data } = await apiClient.get<ApiResponse<UserProfile>>('/users/profile');
    return data.data;
  },

  updateProfile: async (dto: UpdateProfileDto): Promise<UserProfile> => {
    const { data } = await apiClient.put<ApiResponse<UserProfile>>(
      '/users/profile',
      dto
    );
    return data.data;
  },

  changePassword: async (dto: ChangePasswordDto): Promise<void> => {
    await apiClient.patch('/users/password', dto);
  },

  deleteAccount: async (dto: DeleteAccountDto): Promise<void> => {
    await apiClient.delete('/users/account', { data: dto });
  },
};
