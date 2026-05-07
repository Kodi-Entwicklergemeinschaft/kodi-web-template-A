import apiRequest from '@/api/apiRequest';
import API_URLS from '@/api/apiURl';

export type TileData = {
  id: string;
  slug: string;
  backgroundImageUrl: string | null;
  headerBackgroundColor: string;
  header: string;
  subheader: string;
  description: string;
  contentBackgroundColor: string;
  websiteUrl: string | null;
  iconImageUrl: string | null;
  openInExternalBrowser: boolean;
  displayOrder: number;
  isActive: true;
  publishAt: string | null;
  expireAt: string | null;
  createdByUserId: string;
  lastEditedByUserId: string;
  createdAt: string;
  updatedAt: string;
  cities: [
    {
      id: string;
      cityId: string;
      isPrimary: boolean;
      displayOrder: number;
    },
  ];
};

export type TileListingDataResponse = {
  items: TileData[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

export type TileListingsQueryParams = {
  page: number;
  pageSize: number;
  search?: string;
  showExternalListings?: boolean;
  statusId: number;
  sortBy: string;
  sortDirection: string;
  isActive?: boolean;
};

export const getTileListings = async (queryParams: TileListingsQueryParams) => {
  return await apiRequest<TileListingDataResponse>({
    url: API_URLS.GetAllTiles,
    method: 'GET',
    params: queryParams,
  });
};

export const deleteTileListing = async (tileId: number | string) => {
  return await apiRequest({
    url: `${API_URLS.Tiles}/${tileId}`,
    method: 'DELETE',
  });
};
