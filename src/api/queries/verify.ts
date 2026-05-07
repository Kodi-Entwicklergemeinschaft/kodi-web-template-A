import { useQuery } from '@tanstack/react-query';

import { verifyResetPassToken } from '@/api/endpoints';

export const useVerifyPasswordToken = (token: string) => {
  return useQuery({
    queryKey: ['verify-password-token', token],
    queryFn: () => verifyResetPassToken(),
  });
};
