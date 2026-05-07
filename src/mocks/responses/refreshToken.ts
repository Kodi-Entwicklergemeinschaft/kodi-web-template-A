import { ApiSuccessResponse } from '@/api/api.type';

type SuccessRefresh = ApiSuccessResponse<{ newToken: string }>;
const RefreshSuccess: SuccessRefresh = {
  success: true,
  data: {
    newToken: 'newToken',
  },
};

export { RefreshSuccess };
