import { ApiErrorResponse, ApiSuccessResponse } from '@/api/api.type';
import {
  TileData,
  TileListingDataResponse,
} from '@/api/endpoints/tileListings';

type SuccessResponse = ApiSuccessResponse<TileListingDataResponse>;

const TileListingsResponse: SuccessResponse = {
  success: true,
  data: {
    items: [
      {
        id: '34ae09f9-358e-4e63-babc-e962d8a2b5d9',
        slug: 'kodigutschein-new',
        backgroundImageUrl:
          'https://kiel.nbg1.your-objectstorage.com/tiles/34ae09f9-358e-4e63-babc-e962d8a2b5d9/background.webp',
        headerBackgroundColor: '#1E40AF',
        header: 'KODIgutschein new',
        iconImageUrl: null,
        subheader: 'Ein Gutschein, so viele Möglichkeiten',
        description:
          'Der KODIGutschein steht für bunte Vielfalt und kann bei über 120 lokalen Geschäften eingelöst werden.',
        contentBackgroundColor: '#3B82F6',
        websiteUrl: 'https://www.kiel.de/gutschein',
        openInExternalBrowser: false,
        displayOrder: 0,
        isActive: true,
        publishAt: null,
        expireAt: null,
        createdByUserId: 'c431eb58-be78-43ce-a610-55513c91d2a6',
        lastEditedByUserId: 'c431eb58-be78-43ce-a610-55513c91d2a6',
        createdAt: '2025-11-13T09:37:45.393Z',
        updatedAt: '2025-11-13T09:39:14.205Z',
        cities: [
          {
            id: '50e5b5ff-bf9f-453d-b1a9-ddbc43ea9d42',
            cityId: '30cf5d58-f30d-486f-9f19-ae1d7f761516',
            isPrimary: false,
            displayOrder: 0,
          },
        ],
      },
      {
        id: 'b308961b-4ea6-4d3b-9b16-b2a04eb483c7',
        slug: 'kodigutschein-new-2',
        backgroundImageUrl:
          'https://kiel.nbg1.your-objectstorage.com/tiles/b308961b-4ea6-4d3b-9b16-b2a04eb483c7/background.webp',
        headerBackgroundColor: '#1E40AF',
        header: 'KODIgutschein new 2',
        iconImageUrl: null,
        subheader: 'Ein Gutschein, so viele Möglichkeiten',
        description:
          'Der KODIGutschein steht für bunte Vielfalt und kann bei über 120 lokalen Geschäften eingelöst werden.',
        contentBackgroundColor: '#3B82F6',
        websiteUrl: 'https://www.kiel.de/gutschein',
        openInExternalBrowser: false,
        displayOrder: 0,
        isActive: true,
        publishAt: null,
        expireAt: null,
        createdByUserId: 'c431eb58-be78-43ce-a610-55513c91d2a6',
        lastEditedByUserId: 'c431eb58-be78-43ce-a610-55513c91d2a6',
        createdAt: '2025-11-13T09:44:47.575Z',
        updatedAt: '2025-11-13T09:45:26.912Z',
        cities: [
          {
            id: 'd44b3b5e-1135-48d6-86b3-78ccc9d6c60b',
            cityId: '30cf5d58-f30d-486f-9f19-ae1d7f761516',
            isPrimary: false,
            displayOrder: 0,
          },
        ],
      },
    ],
    meta: {
      page: 1,
      pageSize: 20,
      total: 2,
      totalPages: 1,
    },
  },
  message: 'Operation completed successfully',
};
type TileSuccessResponse = ApiSuccessResponse<TileData>;
const TileResponse: TileSuccessResponse = {
  success: true,
  data: {
    id: '34ae09f9-358e-4e63-babc-e962d8a2b5d9',
    slug: 'kodigutschein-new',
    backgroundImageUrl:
      'https://kiel.nbg1.your-objectstorage.com/tiles/34ae09f9-358e-4e63-babc-e962d8a2b5d9/background.webp',
    headerBackgroundColor: '#1E40AF',
    header: 'KODIgutschein new',
    iconImageUrl: null,
    subheader: 'Ein Gutschein, so viele Möglichkeiten',
    description:
      'Der KODIGutschein steht für bunte Vielfalt und kann bei über 120 lokalen Geschäften eingelöst werden.',
    contentBackgroundColor: '#3B82F6',
    websiteUrl: 'https://www.kiel.de/gutschein',
    openInExternalBrowser: false,
    displayOrder: 0,
    isActive: true,
    publishAt: null,
    expireAt: null,
    createdByUserId: 'c431eb58-be78-43ce-a610-55513c91d2a6',
    lastEditedByUserId: 'c431eb58-be78-43ce-a610-55513c91d2a6',
    createdAt: '2025-11-13T09:37:45.393Z',
    updatedAt: '2025-11-13T09:39:14.205Z',
    cities: [
      {
        id: 'd44b3b5e-1135-48d6-86b3-78ccc9d6c60b',
        cityId: '30cf5d58-f30d-486f-9f19-ae1d7f761516',
        isPrimary: false,
        displayOrder: 0,
      },
    ],
  },
  message: 'Operation completed successfully',
};

const ErrorTileListingsResponse: ApiErrorResponse = {
  success: false,
  error: 'Wrong Password',
  code: 'INTERNAL_SERVER_ERROR',
  status: 500,
};

const TileDeleteSuccessResponse: ApiSuccessResponse<unknown> = {
  data: undefined,
  message: 'Successfully Deleted',
  success: true,
  status: 200,
};

const TileDeleteErrorResponse: ApiErrorResponse = {
  error: 'Failed to Delete Tile',
  code: 'INTERNAL_SERVER_ERROR',
  status: 500,
  success: false,
};

export {
  ErrorTileListingsResponse,
  TileDeleteErrorResponse,
  TileDeleteSuccessResponse,
  TileListingsResponse,
  TileResponse,
};
