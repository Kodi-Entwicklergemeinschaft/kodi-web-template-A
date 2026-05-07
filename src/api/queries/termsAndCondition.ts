import { useQuery } from '@tanstack/react-query';

import { getTermsAndCondition } from '@/api/endpoints/termsAndCond';
import i18n from '@/i18n';

export const useTermsAndConditions = () => {
  return useQuery({
    queryKey: [i18n.language],
    queryFn: getTermsAndCondition,
  });
};
