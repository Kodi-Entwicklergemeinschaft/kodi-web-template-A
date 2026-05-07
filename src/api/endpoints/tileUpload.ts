import apiRequest from '@/api/apiRequest';
import API_URLS from '@/api/apiURl';

export type TileUploadPayload = {
  headerBackgroundColor: string;
  header: string;
  subheader: string;
  description: string;
  contentBackgroundColor: string;
  websiteUrl?: string | null;
  opnInExternalBrowser?: boolean;
  displayOrder?: number;
  isActive?: boolean;
  backgroundImageUrl?: File | string | null;
  iconImageUrl?: File | string | null;
  cities?: {
    cityId: string | false | undefined;
    isPrimary: boolean;
    displayOrder: number;
  }[];
};
export type EditTileUploadPayload = {
  headerBackgroundColor?: string;
  header?: string;
  subheader?: string;
  description?: string;
  contentBackgroundColor?: string;
  websiteUrl?: string | null;
  opnInExternalBrowser?: boolean;
  displayOrder?: number;
  isActive?: boolean;
  backgroundImageUrl?: File | string | null;
  iconImageUrl?: File | string | null;
  cities?: {
    id?: string;
    cityId: string | false | undefined;
    isPrimary: boolean;
    displayOrder: number;
  }[];
};

export type TileUploadResponse = {
  id: string;
  slug: string;
} & TileUploadPayload;

export const createTileUpload = async (payload: TileUploadPayload) => {
  return await apiRequest<TileUploadResponse>({
    url: API_URLS.Tiles,
    method: 'POST',
    data: payload,
  });
};

export const editTileUpload = async (
  tileId: string | number,
  payload: EditTileUploadPayload
) => {
  return await apiRequest<TileUploadResponse>({
    url: API_URLS.Tiles + `/${tileId}`,
    method: 'PATCH',
    data: payload,
  });
};

export const getTile = async (tileId: string | number) => {
  return await apiRequest<TileUploadPayload>({
    url: API_URLS.Tiles + `/${tileId}`,
  });
};
