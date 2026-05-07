import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createTileUpload,
  editTileUpload,
  EditTileUploadPayload,
  getTile,
} from '@/api/endpoints/tileUpload';
import i18n from '@/i18n';

export const useCreateTileUpload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTileUpload,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['tileListings'] });
      }
    },
  });
};

export const useEditTileUpload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      tileId,
      payload,
    }: {
      tileId: number | string;
      payload: EditTileUploadPayload;
    }) => editTileUpload(tileId, payload),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['tileListings'] });
      }
    },
  });
};

export const useGetTile = (id: string | number) => {
  return useQuery({
    queryKey: ['userGetTile', id, i18n.language],
    queryFn: () => getTile(id as string | number),
    enabled: id !== undefined && id !== null && id !== '',
    refetchOnWindowFocus: false,
  });
};
