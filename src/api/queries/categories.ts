import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { CityCategoryListParams, getCityCategories } from '@/api/endpoints';
import {
  CategoryListingsQueryParams,
  createCategory,
  deleteCategory,
  deleteCategoryIcon,
  deleteCategoryImage,
  deleteCityCategoryIcon,
  deleteCityCategoryImage,
  editCategory,
  EditCategoryUploadPayload,
  getCategories,
  getCategory,
  getCityCategory,
  updateCityCategory,
  uploadCategoryIcon,
  uploadCategoryImage,
  uploadCityCategoryIcon,
  uploadCityCategoryImage,
} from '@/api/endpoints';
import i18n from '@/i18n';

export const useGetCityCategories = (params: CityCategoryListParams) =>
  useQuery({
    queryKey: ['cityCategories', i18n.language, params],
    queryFn: () => getCityCategories(params),
    enabled: !!params.cityId,
  });

export const useGetCategories = (queryParams: CategoryListingsQueryParams) =>
  useQuery({
    queryKey: ['categories', queryParams, i18n.language],
    queryFn: () => getCategories(queryParams),
    refetchOnWindowFocus: false,
  });

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: string | number) => deleteCategory(categoryId),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['categories'] });
      }
    },
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['categories'] });
      }
    },
  });
};

export const useEditCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      categoryId,
      payload,
    }: {
      categoryId: number | string;
      payload: EditCategoryUploadPayload;
    }) => editCategory(categoryId, payload),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['categories'] });
        queryClient.invalidateQueries({
          queryKey: ['categories'],
        });
      }
    },
  });
};

export const useGetCategory = (id: string | number) => {
  return useQuery({
    queryKey: ['getCategory', id, i18n.language],
    queryFn: () => getCategory(id as string | number),
    enabled: id !== undefined && id !== null && id !== '',
    refetchOnWindowFocus: false,
    refetchOnMount: 'always',
  });
};

export const useUploadCategoryIcon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      uploadCategoryIcon(id, file),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['categories'] });
        queryClient.invalidateQueries({
          queryKey: ['categories'],
        });
      }
    },
  });
};

export const useUploadCategoryImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      uploadCategoryImage(id, file),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['categories'] });
        queryClient.invalidateQueries({
          queryKey: ['categories'],
        });
      }
    },
  });
};
export const useDeleteCategoryIcon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string }) => deleteCategoryIcon(id),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['categories'] });
        queryClient.invalidateQueries({
          queryKey: ['categories'],
        });
      }
    },
  });
};
export const useDeleteCategoryImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string }) => deleteCategoryImage(id),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['categories'] });
        queryClient.invalidateQueries({
          queryKey: ['categories'],
        });
      }
    },
  });
};

export const useUpdateCityCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      cityId,
      categoryId,
      payload,
    }: {
      cityId: number | string;
      categoryId: number | string;
      payload: EditCategoryUploadPayload;
    }) => updateCityCategory(cityId, categoryId, payload),

    onSuccess: (data, variables) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['categories'] });

        queryClient.invalidateQueries({
          queryKey: ['getCityCategory', variables.categoryId],
        });
      }
    },
  });
};
export const useUploadCityCategoryIcon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      cityId,
      categoryId,
      file,
    }: {
      cityId: string;
      categoryId: string;
      file: File;
    }) => uploadCityCategoryIcon(cityId, categoryId, file),
    onSuccess: (data, variables) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['categories'] });
        queryClient.invalidateQueries({
          queryKey: ['getCityCategory', variables.categoryId],
        });
      }
    },
  });
};

export const useUploadCityCategoryImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      cityId,
      categoryId,
      file,
    }: {
      cityId: string;
      categoryId: string;
      file: File;
    }) => uploadCityCategoryImage(cityId, categoryId, file),
    onSuccess: (data, variables) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['categories'] });
        queryClient.invalidateQueries({
          queryKey: ['getCityCategory', variables.categoryId],
        });
      }
    },
  });
};

export const useDeleteCityCategoryIcon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      cityId,
      categoryId,
    }: {
      cityId: string;
      categoryId: string;
    }) => deleteCityCategoryIcon(cityId, categoryId),
    onSuccess: (data, variables) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['categories'] });
        queryClient.invalidateQueries({
          queryKey: ['getCityCategory', variables.categoryId],
        });
      }
    },
  });
};

export const useDeleteCityCategoryImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      cityId,
      categoryId,
    }: {
      cityId: string;
      categoryId: string;
    }) => deleteCityCategoryImage(cityId, categoryId),
    onSuccess: (data, variables) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['categories'] });
        queryClient.invalidateQueries({
          queryKey: ['getCityCategory', variables.categoryId],
        });
      }
    },
  });
};
export const useGetCityCategory = (cityId: string, categoryId: string) => {
  return useQuery({
    queryKey: ['getCityCategory', cityId, categoryId, i18n.language],
    queryFn: () => getCityCategory(cityId, categoryId),
    enabled: !!cityId && !!categoryId,
    refetchOnWindowFocus: false,
    refetchOnMount: 'always',
  });
};
