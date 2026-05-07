import { useQuery } from '@tanstack/react-query';

import { getAllTags, QueryParams } from '@/api/endpoints';
import i18n from '@/i18n';

export const useGetAllTags = (queryParams: QueryParams) => {
  return useQuery({
    queryKey: ['AllTags', i18n.language, queryParams],
    queryFn: () => getAllTags(queryParams),
  });
};
