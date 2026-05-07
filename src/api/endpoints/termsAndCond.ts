import apiRequest from '@/api/apiRequest';
import API_URLS from '@/api/apiURl';

interface TagsResponse {
  id: string;
  version: string;
  title: string;
  content: string;
  locale: string;
  isActive: boolean;
  isLatest: boolean;
  gracePeriodDays: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export const getTermsAndCondition = async () => {
  return await apiRequest<TagsResponse>({
    url: API_URLS.GetLatestTermsAndConditions,
    method: 'GET',
  });
};
