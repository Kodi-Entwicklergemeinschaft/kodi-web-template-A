import API_URLS from '@/api/apiURl';
import { RoleValue } from '@/lib/constant';

import apiRequest from '../apiRequest';
export type SignInUserResponse = {
  user: {
    id: string;
    email: string;
    username: string;
    role: RoleValue;
    userType: string;
    firstName: string;
    lastName: string;
  };
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  requiresTermsAcceptance: boolean;
  termsId: string;
  latestVersion: string;
  gracePeriodEndsAt: string;
};

type LoginForm = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export const signInUser = async (userFormData: LoginForm) => {
  return await apiRequest<SignInUserResponse, LoginForm>({
    url: API_URLS.LogIn,
    method: 'POST',
    data: userFormData,
  });
};
