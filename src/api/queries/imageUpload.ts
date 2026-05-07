import { useMutation, useQueryClient } from '@tanstack/react-query';

import { uploadTileImage } from '@/api/endpoints/imageUpload';

export const useUploadImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadTileImage,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['tileListings'] });
      }
    },
  });
};
