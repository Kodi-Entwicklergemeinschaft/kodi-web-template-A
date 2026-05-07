import apiRequest from '@/api/apiRequest';
import API_URLS from '@/api/apiURl';

export type TileUploadPayload = {
  headerBackgroundColor: string;
  header: string;
  subheader: string;
  description: string;
  contentBackgroundColor: string;
  websiteUrl?: string | null;
  opnInExternalBrowser?: false;
  displayOrder?: number;
  isActive?: boolean;
  backgroundImageUrl: File | string | null;
  iconImageUrl: File | string | null;
  cities?: [
    {
      cityId: string;
      isPrimary: boolean;
      displayOrder: number;
    },
  ];
};

export type TileUploadResponse = {
  success: boolean;
  message: string;
  data?: {
    id: string;
    slug: string;
  } & TileUploadPayload;
};

export type TileImageUpload = {
  file: File | null;
};
export type ImageUploadPayload = {
  payload: TileImageUpload;
  id: string;
  path: string;
};

export const uploadTileImage = async ({
  payload,
  id,
  path,
}: ImageUploadPayload) => {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== null) {
      formData.append(key, value as Blob | string);
    }
  });
  return await apiRequest<TileUploadResponse>({
    url: `${API_URLS.Tiles}/${id}/${path}`,
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

type ListHeroImageDeletePayload = {
  id: string;
};
export const deleteListHeroImage = async ({
  id,
}: ListHeroImageDeletePayload) => {
  return await apiRequest<TileUploadResponse>({
    url: `${API_URLS.Listings}/${id}/hero-image`,
    method: 'DELETE',
  });
};
type DeleteMediaListPayload = {
  id: string;
  ids: {
    id: string;
  }[];
};
export const deleteListMediaImages = async ({
  id,
  ids,
}: DeleteMediaListPayload) => {
  return await apiRequest<TileUploadResponse>({
    url: `${API_URLS.Listings}/${id}/media`,
    method: 'DELETE',
    data: ids,
  });
};
