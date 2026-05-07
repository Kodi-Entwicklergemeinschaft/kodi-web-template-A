import { ApiErrorResponse, ApiSuccessResponse } from '@/api/api.type';
import { TileUploadResponse } from '@/api/endpoints/tileUpload';

const TileUploadCreateSuccessResponse: ApiSuccessResponse<TileUploadResponse> =
  {
    success: true,
    message: 'Tile successfully created',
    status: 200,
    data: {
      id: 'tile_01J3MJG0YX6FT5PB9SJ9Y2KQW4',
      slug: 'kodi-gift-card-promo',
      headerBackgroundColor: '#1E40AF',
      header: 'KODIgutschein',
      subheader: 'Ein Gutschein, so viele Möglichkeiten',
      description: 'Der KODIGutschein steht für bunte Vielfalt...',
      contentBackgroundColor: '#3B82F6',
      websiteUrl: 'https://www.kiel.de/gutschein',
      displayOrder: 0,
      isActive: true,
      cities: [
        {
          cityId: 'city_01J3MJG0YX6FT5PB9SJ9Y2KQW4',
          isPrimary: true,
          displayOrder: 0,
        },
      ],
    },
  };

const TileUploadCreateErrorResponse: ApiErrorResponse = {
  success: false,
  error: 'Failed to create tile upload',
  code: 'INTERNAL_SERVER_ERROR',
  status: 500,
};

const TileUploadEditSuccessResponse: ApiSuccessResponse<TileUploadResponse> = {
  success: true,
  message: 'Tile successfully updated',
  status: 200,
  data: {
    id: 'tile_01J3MJG0YX6FT5PB9SJ9Y2KQW4',
    slug: 'kodi-gift-card-promo',
    headerBackgroundColor: '#1E40AF',
    header: 'KODIgutschein',
    subheader: 'Ein Gutschein, so viele Möglichkeiten',
    description: 'Der KODIGutschein steht für bunte Vielfalt...',
    contentBackgroundColor: '#3B82F6',
    websiteUrl: 'https://www.kiel.de/gutschein',
    displayOrder: 0,
    isActive: true,
    cities: [
      {
        cityId: 'city_01J3MJG0YX6FT5PB9SJ9Y2KQW4',
        isPrimary: true,
        displayOrder: 0,
      },
    ],
  },
};

const TileUploadEditErrorResponse: ApiErrorResponse = {
  success: false,
  error: 'Failed to edit tile upload',
  code: 'INTERNAL_SERVER_ERROR',
  status: 500,
};

export {
  TileUploadCreateErrorResponse,
  TileUploadCreateSuccessResponse,
  TileUploadEditErrorResponse,
  TileUploadEditSuccessResponse,
};
