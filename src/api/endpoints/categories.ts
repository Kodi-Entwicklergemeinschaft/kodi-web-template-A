import apiRequest from '@/api/apiRequest';
import API_URLS from '@/api/apiURl';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  subtitle: string;
  imageUrl: string;
  iconUrl: string | null;
  headerBackgroundColor: string;
  contentBackgroundColor: string;
  type: string; // e.g., "EVENT"
  parentId: string | null;
  languageCode: string | null;
  isActive: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  children: Category[];
}

export type CityCategoryList = {
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  items: Category[];
};

export type CategoryUploadPayload = {
  name?: string | null | undefined;
  subtitle?: string | null | undefined;
  description?: string | null | undefined;
  headerBackgroundColor?: string | null | undefined;
  contentBackgroundColor?: string | null | undefined;
  iconImageUrl?: File | string | null;
  backgroundImageUrl?: File | string | null;
  parentId?: string | null;
  isActive?: boolean;
};

export type EditCategoryUploadPayload = {
  name?: string;
  subtitle?: string | null;
  description?: string | null;
  headerBackgroundColor?: string | null;
  contentBackgroundColor?: string | null;
  iconImageUrl?: File | string | null;
  backgroundImageUrl?: File | string | null;
  parentId?: string | null;
  isActive?: boolean;
};

export type CategoryUploadResponse = {
  id: string;
  slug: string;
} & CategoryUploadPayload;

export type CategoryData = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  subtitle?: string | null;
  imageUrl?: string | null;
  iconUrl?: string | null;
  headerBackgroundColor?: string | null;
  contentBackgroundColor?: string | null;
  type?: string | null;
  parentId?: string | null;
  languageCode?: string | null;
  displayOrder?: number | null;
  isActive?: boolean;
  createdAt: string;
  updatedAt?: string;
  cityCategoryDisplayOrder?: number | null;
  children?: CategoryData[];
};

type CategoryTableData = {
  items: CategoryData[];
  meta: {
    page: 1;
    pageSize: 10;
    total: 125;
    totalPages: 13;
  };
};

export type CategoryListingsQueryParams = {
  page: number;
  pageSize: number;
  search?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  isActive?: boolean;
  showAll: boolean;
};

export type CityCategoryListParams = {
  cityId: string;
  showAll?: boolean;
  sortBy?: string;
  sortDirection?: string;
  page: number;
  pageSize: number;
};

export const getCityCategories = async ({
  cityId,
  ...params
}: CityCategoryListParams) => {
  return await apiRequest<CityCategoryList>({
    url: API_URLS.GetCityCategories.concat(`/${cityId}`),
    method: 'GET',
    params,
  });
};

export const getCategories = async (
  queryParams: CategoryListingsQueryParams
) => {
  return await apiRequest<CategoryTableData>({
    url: API_URLS.CreateCategory,
    method: 'GET',
    params: queryParams,
  });
};

export const deleteCategory = async (categoryId: string | number) => {
  return await apiRequest({
    url: `${API_URLS.CreateCategory}/${categoryId}`,
    method: 'DELETE',
  });
};

export const createCategory = async (payload: CategoryUploadPayload) => {
  return await apiRequest<CategoryUploadResponse>({
    url: API_URLS.CreateCategory,
    method: 'POST',
    data: payload,
  });
};

export const editCategory = async (
  categoryId: string | number,
  payload: EditCategoryUploadPayload
) => {
  return await apiRequest<CategoryUploadResponse>({
    url: API_URLS.CreateCategory + `/${categoryId}`,
    method: 'PATCH',
    data: payload,
  });
};

export const getCategory = async (categoryId: string | number) => {
  return await apiRequest<Category>({
    url: API_URLS.CreateCategory + `/${categoryId}`,
    params: {
      showAll: true,
    },
  });
};

export const uploadCategoryIcon = async (id: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  return await apiRequest<CategoryUploadResponse>({
    url: API_URLS.CreateCategory + `/${id}/icon`,
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const uploadCategoryImage = async (id: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  return await apiRequest<CategoryUploadResponse>({
    url: API_URLS.CreateCategory + `/${id}/image`,
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteCategoryIcon = async (id: string | number) => {
  return await apiRequest({
    url: API_URLS.CreateCategory + `/${id}/icon`,
    method: 'DELETE',
  });
};
export const deleteCategoryImage = async (id: string | number) => {
  return await apiRequest({
    url: API_URLS.CreateCategory + `/${id}/image`,
    method: 'DELETE',
  });
};

export const updateCityCategory = async (
  cityId: string | number,
  categoryId: string | number,
  payload: EditCategoryUploadPayload
) => {
  return await apiRequest<CategoryUploadResponse>({
    url: API_URLS.CreateCategory + `/cities/${cityId}/categories/${categoryId}`,
    method: 'PATCH',
    data: payload,
  });
};
export const uploadCityCategoryIcon = async (
  cityId: string | number,
  categoryId: string | number,
  file: File
) => {
  const formData = new FormData();
  formData.append('file', file);

  return await apiRequest<CategoryUploadResponse>({
    url:
      API_URLS.CreateCategory +
      `/cities/${cityId}/categories/${categoryId}/icon`,
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const uploadCityCategoryImage = async (
  cityId: string | number,
  categoryId: string | number,
  file: File
) => {
  const formData = new FormData();
  formData.append('file', file);

  return await apiRequest<CategoryUploadResponse>({
    url:
      API_URLS.CreateCategory +
      `/cities/${cityId}/categories/${categoryId}/image`,
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
export const deleteCityCategoryIcon = async (
  cityId: string | number,
  categoryId: string | number
) => {
  return await apiRequest({
    url:
      API_URLS.CreateCategory +
      `/cities/${cityId}/categories/${categoryId}/icon`,
    method: 'DELETE',
  });
};

export const deleteCityCategoryImage = async (
  cityId: string | number,
  categoryId: string | number
) => {
  return await apiRequest({
    url:
      API_URLS.CreateCategory +
      `/cities/${cityId}/categories/${categoryId}/image`,
    method: 'DELETE',
  });
};
export const getCityCategory = async (cityId: string, categoryId: string) => {
  return await apiRequest<Category>({
    url: API_URLS.CreateCategory + `/cities/${cityId}/categories/${categoryId}`,
    params: {
      showAll: true,
    },
  });
};
