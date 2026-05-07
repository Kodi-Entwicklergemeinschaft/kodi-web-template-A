import apiRequest from '@/api/apiRequest';
import API_URLS from '@/api/apiURl';
import { RoleValue } from '@/lib/constant';
type CityAdminList = {
  id: string;
  email: string | null;
  username: string | null;
  role: RoleValue;
  firstName: string | null;
  lastName: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AdminListingDataResponse = {
  success: boolean;
  users: CityAdminList[];
  total: number;
  page: number;
  limit: number;
  pages: number;
  message: string;
  timestamp: string;
  path: string;
  statusCode: number;
};

export type AdminListingsQueryParams = {
  page: number;
  limit: number;
  search?: string;
  role?: RoleValue;
  isActive?: boolean;
};

export type UpdateAdminListingPayload = {
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  role?: RoleValue;
};

export type AssignRolePayload = {
  userId?: string;
  cityId?: string;
  role?: RoleValue;
};

export const getAdminListings = async (
  queryParams: AdminListingsQueryParams
) => {
  return await apiRequest<AdminListingDataResponse>({
    url: API_URLS.GetAdminListing,
    method: 'GET',
    params: queryParams,
  });
};

export const deleteAdminListing = async (listId: number | string) => {
  return await apiRequest({
    url: `${API_URLS.DeleteUser}${listId}`,
    method: 'DELETE',
  });
};

export const updateAdminListing = async (
  listId: number | string,
  payload: UpdateAdminListingPayload
) => {
  return await apiRequest({
    url: `${API_URLS.UpdateUser}${listId}`,
    method: 'PATCH',
    data: payload,
  });
};

export const assignRole = async (payload: AssignRolePayload) => {
  return await apiRequest({
    url: API_URLS.AssignRole,
    method: 'POST',
    data: payload,
  });
};

export const restoreAdminListing = async (id: string | number) => {
  const url = API_URLS.RestoreUser.replace(':id', String(id));

  return await apiRequest({
    url,
    method: 'PATCH',
  });
};
