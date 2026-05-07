import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  deleteTileListing,
  getTileListings,
  TileListingsQueryParams,
} from '@/api/endpoints/tileListings';
import i18n from '@/i18n';

export const useGetTileListings = (queryParams: TileListingsQueryParams) =>
  useQuery({
    queryKey: ['tileListings', queryParams, i18n.language],
    queryFn: () => getTileListings(queryParams),
    refetchOnWindowFocus: false,
  });

export const useDeleteTileListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTileListing,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['tileListings'] });
      }
    },
  });
};
