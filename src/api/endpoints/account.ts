import apiRequest from '@/api/apiRequest';
import API_URLS from '@/api/apiURl';
export type UserProfileData = Partial<{
  name: string;
  username: string;
  email: string;
  phoneNumber: string;
  description: string;
  website: string;
}>;

export type UserProfileMetaData = {
  id?: number;
  name: string;
  link: string;
};

export type GetUserProfileResponse = UserProfileData & {
  metadata: UserProfileMetaData[];
  id: number;
};

export const getUserProfile = async () => {
  return await apiRequest<GetUserProfileResponse>({
    url: API_URLS.Profile,
  });
};

export const updateUserProfile = async (data: UserProfileData) => {
  return await apiRequest({
    url: 'profile',
    method: 'PUT',
    data,
  });
};

export const updateUserMetadata = async (data: UserProfileMetaData[]) => {
  return await apiRequest({
    url: 'profile/metadata',
    method: 'PUT',
    data,
  });
};

type UpdateUserPassword = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export const updateUserPassword = async (data: UpdateUserPassword) => {
  const { confirmPassword, ...restData } = data;
  void confirmPassword;
  return await apiRequest({
    url: API_URLS.UpdateUserPassword,
    method: 'POST',
    data: restData,
  });
};

export const deleteAccount = async () => {
  return await apiRequest({
    url: 'profile',
    method: 'DELETE',
  });
};
