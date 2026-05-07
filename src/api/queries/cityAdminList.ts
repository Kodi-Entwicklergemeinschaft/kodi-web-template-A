import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  AdminListingsQueryParams,
  assignRole,
  createAdmin,
  deleteAdminListing,
  getAdminListings,
  restoreAdminListing,
  updateAdminListing,
  UpdateAdminListingPayload,
} from '@/api/endpoints';
import i18n from '@/i18n';

export const useGetAdminListings = (queryParams: AdminListingsQueryParams) =>
  useQuery({
    queryKey: ['adminListings', queryParams, i18n.language],
    queryFn: () => getAdminListings(queryParams),
    refetchOnWindowFocus: false,
  });

export const useDeleteAdminListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdminListing,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['adminListings'] });
      }
    },
  });
};

export const useCreateAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdmin,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['adminListings'] });
      }
    },
  });
};

export const useUpdateAdminListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string | number;
      payload: UpdateAdminListingPayload;
    }) => updateAdminListing(id, payload),

    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['adminListings'] });
      }
    },
  });
};

export const useAssignRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignRole,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['adminListings'] });
      }
    },
  });
};

export const useRestoreAdminListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string | number) => restoreAdminListing(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminListings'] });
    },
  });
};
