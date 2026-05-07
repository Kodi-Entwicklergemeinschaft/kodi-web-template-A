import { useMutation } from '@tanstack/react-query';

import { confirmPassword, resetPassword } from '@/api/endpoints/resetPassword';

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
  });
};

export const useConfirmResetPassword = () => {
  return useMutation({
    mutationFn: confirmPassword,
  });
};
