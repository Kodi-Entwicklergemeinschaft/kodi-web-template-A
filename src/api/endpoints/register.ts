import API_URLS from '@/api/apiURl';
import { RoleValue } from '@/lib/constant';

import apiRequest from '../apiRequest';

export type RegisterUserResponse = {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role?: RoleValue;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type RegisterForm = {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
};

export const registerUser = async (userFormData: RegisterForm) => {
  return await apiRequest<RegisterUserResponse, RegisterForm>({
    url: API_URLS.Register,
    method: 'POST',
    data: userFormData,
  });
};

type PatchUserForm = {
  userFormData: Partial<RegisterForm>;
};

export const patchUser = async ({ userFormData }: PatchUserForm) => {
  return await apiRequest<RegisterUserResponse, Partial<RegisterForm>>({
    url: `${API_URLS.Profile}`,
    method: 'PATCH',
    data: userFormData,
  });
};
