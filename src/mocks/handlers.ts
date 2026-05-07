import API_URLS from '@/api/apiURl';
import {
  ProfileSuccessData,
  UpdateProfileSuccess,
} from '@/mocks/responses/account';
import {
  AdminDeleteSuccessResponse,
  AdminListingsResponse,
} from '@/mocks/responses/adminListings';
import { ListingsResponse } from '@/mocks/responses/allListings';
import { CreateAdminResponse } from '@/mocks/responses/createAdmin';
import { RefreshSuccess } from '@/mocks/responses/refreshToken';
import {
  RegisterErrorResponse,
  RegisterSuccessResponse,
} from '@/mocks/responses/register';
import {
  ErrorUserResponse,
  LogoutUserResponse,
  SuccessUserResponse,
} from '@/mocks/responses/signIn';
import {
  TileDeleteSuccessResponse,
  TileListingsResponse,
  TileResponse,
} from '@/mocks/responses/tileListings';
import { fetchApi } from '@/mocks/utils/fetchApi';

import {
  TileUploadCreateErrorResponse,
  TileUploadCreateSuccessResponse,
  TileUploadEditErrorResponse,
  TileUploadEditSuccessResponse,
} from './responses/tileUpload';

const {
  LogIn,
  LogOut,
  Register,
  RefreshToken,
  UpdateUserPassword,
  GetAllTiles,
  Tiles,
  Account,
  Profile,
  Listings,
} = API_URLS;

// ✅ Handlers
export const handlers = [
  fetchApi(LogIn, 'post', SuccessUserResponse, 'success'),
  fetchApi('signin/error', 'post', ErrorUserResponse, 'error'),
  fetchApi(Register, 'post', RegisterSuccessResponse, 'success'),
  fetchApi('users/:id', 'patch', RegisterSuccessResponse, 'success'),
  fetchApi(Account, 'post', CreateAdminResponse, 'success'),
  fetchApi('register/error', 'post', RegisterErrorResponse, 'error'),
  fetchApi(GetAllTiles, 'get', TileListingsResponse, 'success', 1500),
  fetchApi(Account, 'get', AdminListingsResponse, 'success', 1500),
  fetchApi(
    'adminListings/:id',
    'delete',
    AdminDeleteSuccessResponse,
    'success',
    3000
  ),
  fetchApi(`${Tiles}/:id`, 'get', TileResponse, 'success', 3000),
  fetchApi(
    `${Tiles}/:id/background-image`,
    'post',
    TileResponse,
    'success',
    3000
  ),
  fetchApi(
    `${Tiles}/:id`,
    'delete',
    TileDeleteSuccessResponse,
    'success',
    3000
  ),
  fetchApi(Tiles, 'post', TileUploadCreateSuccessResponse, 'success', 1500),
  fetchApi(
    `${Tiles}/error`,
    'post',
    TileUploadCreateErrorResponse,
    'error',
    1500
  ),
  fetchApi(
    `${Tiles}/:id`,
    'put',
    TileUploadEditSuccessResponse,
    'success',
    1500
  ),
  fetchApi(
    `${Tiles}/:id/error`,
    'put',
    TileUploadEditErrorResponse,
    'error',
    1500
  ),
  fetchApi(LogOut, 'post', LogoutUserResponse, 'success'),
  fetchApi(Profile, 'get', ProfileSuccessData, 'success', 1000),
  fetchApi(Profile, 'get', ProfileSuccessData, 'success', 1000),
  // fetchApi('profile', 'get', ErrorUserResponse, 'error', 1000, 401),

  //Lisings
  fetchApi(Listings, 'get', ListingsResponse, 'success', 1000),
  fetchApi(RefreshToken, 'get', RefreshSuccess, 'success'),
  fetchApi(`${Profile}/:id`, 'put', UpdateProfileSuccess, 'success', 1000),
  fetchApi(`${Profile}/:id`, 'delete', ProfileSuccessData, 'success', 2000),
  fetchApi(UpdateUserPassword, 'post', UpdateProfileSuccess, 'success', 1000),
  fetchApi('profile/metadata', 'put', UpdateProfileSuccess, 'success', 1000),
  fetchApi('verify-reset-token', 'get', UpdateProfileSuccess, 'success', 6000),
];
