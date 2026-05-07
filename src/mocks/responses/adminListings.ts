import { ApiErrorResponse, ApiSuccessResponse } from '@/api/api.type';
import { AdminListingDataResponse } from '@/api/endpoints/cityAdminList';
import { USER_ROLE_MAP } from '@/lib/constant';

type SuccessResponse = ApiSuccessResponse<AdminListingDataResponse>;

const AdminListingsResponse: SuccessResponse = {
  success: true,
  data: {
    success: true,
    users: [
      {
        id: '1',
        email: 'admin@example.com',
        username: null,
        role: USER_ROLE_MAP.SUPER_ADMIN,
        firstName: 'John',
        lastName: 'Doe',
        isActive: true,
        createdAt: '2022-01-01T00:00:00.000Z',
        updatedAt: '2022-01-05T00:00:00.000Z',
      },
      {
        id: '2',
        email: 'city-admin@example.com',
        username: null,
        role: USER_ROLE_MAP.CITY_ADMIN,
        firstName: 'Jane',
        lastName: 'Smith',
        isActive: true,
        createdAt: '2022-01-02T00:00:00.000Z',
        updatedAt: '2022-01-06T00:00:00.000Z',
      },
      {
        id: '3',
        email: 'citizen@example.com',
        username: null,
        role: USER_ROLE_MAP.CITIZEN,
        firstName: 'Michael',
        lastName: 'Brown',
        isActive: true,
        createdAt: '2022-01-03T00:00:00.000Z',
        updatedAt: '2022-01-07T00:00:00.000Z',
      },
      {
        id: '4',
        email: 'citizen2@example.com',
        username: null,
        role: USER_ROLE_MAP.CITIZEN,
        firstName: 'Emma',
        lastName: 'Johnson',
        isActive: true,
        createdAt: '2022-01-04T00:00:00.000Z',
        updatedAt: '2022-01-08T00:00:00.000Z',
      },
      {
        id: '5',
        email: 'citizen3@example.com',
        username: null,
        role: USER_ROLE_MAP.CITIZEN,
        firstName: 'Olivia',
        lastName: 'Davis',
        isActive: true,
        createdAt: '2022-01-05T00:00:00.000Z',
        updatedAt: '2022-01-09T00:00:00.000Z',
      },
    ],
    total: 5,
    page: 1,
    limit: 10,
    pages: 1,
    message: 'Admin listings fetched successfully',
    timestamp: new Date().toISOString(),
    path: '/api/admin/listings',
    statusCode: 200,
  },
};

const ErrorAdminListingsResponse: ApiErrorResponse = {
  success: false,
  error: 'Wrong Password',
  code: 'INTERNAL_SERVER_ERROR',
  status: 500,
};

const AdminDeleteSuccessResponse: ApiSuccessResponse<unknown> = {
  data: undefined,
  message: 'Successfully Deleted',
  success: true,
  status: 200,
};

const AdminDeleteErrorResponse: ApiErrorResponse = {
  error: 'Failed to Delete Admin',
  code: 'INTERNAL_SERVER_ERROR',
  status: 500,
  success: false,
};

export {
  AdminDeleteErrorResponse,
  AdminDeleteSuccessResponse,
  AdminListingsResponse,
  ErrorAdminListingsResponse,
};
