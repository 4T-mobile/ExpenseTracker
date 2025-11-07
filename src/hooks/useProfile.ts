import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { usersApi } from '../api/users';
import {
  UpdateProfileDto,
  ChangePasswordDto,
  DeleteAccountDto,
} from '../types/user.type';
import { clearAllStorage } from '../utils/storage';

const QUERY_KEYS = {
  profile: ['users', 'profile'] as const,
};

export const useUserProfile = () => {
  return useQuery({
    queryKey: QUERY_KEYS.profile,
    queryFn: () => usersApi.getProfile(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateProfileDto) => usersApi.updateProfile(dto),
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.profile, data);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile });
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (dto: ChangePasswordDto) => usersApi.changePassword(dto),
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (dto: DeleteAccountDto) => usersApi.deleteAccount(dto),
    onSuccess: async () => {
      await clearAllStorage();
      queryClient.clear();
      router.replace('/login');
    },
  });
};
