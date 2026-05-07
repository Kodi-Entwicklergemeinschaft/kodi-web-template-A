import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  archiveList,
  createListing,
  deleteListing,
  getListings,
  getSelectedListing,
  ListingsQueryParams,
  updateListingData,
  uploadHeroImage,
  uploadMedia,
} from '@/api/endpoints';
import {
  deleteListHeroImage,
  deleteListMediaImages,
} from '@/api/endpoints/imageUpload';
import i18n from '@/i18n';
import { ListUploadForm } from '@/schema/listingUpload';

export const useGetListings = (queryParams: ListingsQueryParams) =>
  useQuery({
    queryKey: ['allListings', queryParams, i18n.language],
    queryFn: () => getListings(queryParams),
    refetchOnWindowFocus: false,
    refetchOnMount: 'always',
  });

export const useGetSelectedListing = (listId: string | undefined) =>
  useQuery({
    queryKey: ['selectedListing', listId, i18n.language],
    queryFn: () => getSelectedListing(listId ?? ''),
    enabled: !!listId,
    refetchOnWindowFocus: false,
    refetchOnMount: 'always',
    select(data) {
      if (data.success && data.data) {
        const coreData = data.data;
        const reformedData: ListUploadForm = {
          ...coreData,
          cities: coreData.cities.map((city) => city.cityId),
          categories: coreData.categories
            .filter((cat) => !cat?.parentId)
            .map((cat) => cat.categoryId),
          subCategories: coreData.categories
            .filter((cat) => cat?.parentId)
            .map((cat) => cat.categoryId),
          tags: coreData.tags.map((tag) => tag.tagId),
          geoLat: coreData.geoLat ? String(coreData.geoLat) : '',
          geoLng: coreData.geoLng ? String(coreData.geoLng) : '',
          address: coreData.address ?? '',
          eventEnd: coreData.eventEnd ? new Date(coreData.eventEnd) : '',
          eventStart: coreData.eventStart ? new Date(coreData.eventStart) : '',
          website: coreData.website ?? '',
          contactEmail: coreData.contactEmail ?? '',
          contactPhone: coreData.contactPhone ?? '',
          heroImageUrl: coreData.heroImageUrl ?? '',
          media: coreData.media?.length
            ? coreData.media.map((media) => media.url)
            : [],
        };
        return {
          ...data,
          data: {
            ...reformedData,
            metadata: {
              ...coreData.metadata,
              media: coreData.media,
              heroImageUrl: coreData.heroImageUrl,
            },
          },
        };
      }
      return data;
    },
  });

export const useDeleteListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteListing,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['allListings'] });
      }
    },
  });
};

export const useCreateListMutate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createListing,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['allListings'] });
      }
    },
  });
};

export const useUploadHeroImageMutate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadHeroImage,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['allListings'] });
      }
    },
  });
};

export const useUploadMediaMutate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadMedia,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['allListings'] });
      }
    },
  });
};

export const useUpdateListingMutate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateListingData,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['allListings'] });
      }
    },
  });
};

export const useArchiveList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: archiveList,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['allListings'] });
      }
    },
  });
};

export const useDeleteHeroImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteListHeroImage,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({
          queryKey: ['allListings'],
        });
      }
    },
  });
};

export const useDeleteMediaImages = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteListMediaImages,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({
          queryKey: ['allListings'],
        });
      }
    },
  });
};
