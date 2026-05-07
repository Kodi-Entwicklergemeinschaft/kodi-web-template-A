import apiRequest from '@/api/apiRequest';
import API_URLS from '@/api/apiURl';

export const logoutUser = async () => {
  return await apiRequest({
    url: API_URLS.LogOut,
    method: 'POST',
  });
};
