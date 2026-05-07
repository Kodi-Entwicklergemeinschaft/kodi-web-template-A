import apiRequest from '@/api/apiRequest';
const verifyResetPassTokenPath = 'auth/validate';

export const verifyResetPassToken = async () => {
  return await apiRequest({
    url: verifyResetPassTokenPath,
    method: 'POST',
  });
};
