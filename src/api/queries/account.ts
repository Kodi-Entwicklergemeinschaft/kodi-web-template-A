import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  deleteAccount,
  getUserProfile,
  patchUser,
  updateUserMetadata,
  updateUserPassword,
} from '@/api/endpoints';
import i18n from '@/i18n';

export const useGetUserProfile = () => {
  return useQuery({
    queryKey: ['userProfile', i18n.language],
    queryFn: getUserProfile,
    refetchOnWindowFocus: false,
  });
};

export const useProfileDataMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchUser,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      }
    },
  });
};

export const useProfileMetaDataMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserMetadata,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      }
    },
  });
};

export const useUpdateUserPassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserPassword,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.clear();
      }
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.clear();
      }
    },
  });
};
