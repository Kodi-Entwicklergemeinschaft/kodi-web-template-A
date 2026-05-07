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

export type ResetPasswordResponse = {
  message: string;
};

type ResetForm = {
  email: string;
};

type ConfirmPassword = {
  token: string;
  newPassword: string;
};

export const resetPassword = async (userFormData: ResetForm) => {
  return await apiRequest<ResetPasswordResponse, ResetForm>({
    url: API_URLS.ResetPassword,
    method: 'POST',
    data: userFormData,
  });
};

export const confirmPassword = async (userFormData: ConfirmPassword) => {
  return await apiRequest<RegisterUserResponse, ConfirmPassword>({
    url: API_URLS.ConfirmResetPassword,
    method: 'POST',
    data: userFormData,
  });
};
