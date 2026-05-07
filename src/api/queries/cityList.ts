import { useQuery } from '@tanstack/react-query';

import { getCityList } from '@/api/endpoints/cityList';
import i18n from '@/i18n';

export const useGetCityList = () =>
  useQuery({
    queryKey: ['cityList', i18n.language],
    queryFn: getCityList,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
