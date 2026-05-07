import apiRequest from '@/api/apiRequest';
import API_URLS from '@/api/apiURl';

export type QueryParams = {
  page: number;
  pageSize: number;
  provider?: string;
  search?: string;
};

interface TagItem {
  id: string;
  provider: string;
  externalValue: string;
  label: string;
  languageCode: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface TagsResponse {
  items: TagItem[];
  meta: PaginationMeta;
}

export const getAllTags = async (params: QueryParams) => {
  return await apiRequest<TagsResponse>({
    url: API_URLS.GetTags,
    params: { ...params, provider: 'DESTINATION_ONE' },
    method: 'GET',
  });
};
