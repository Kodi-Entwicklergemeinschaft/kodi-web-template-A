import { ApiErrorResponse, ApiSuccessResponse } from '@/api/api.type';
import { CreateAdminRes } from '@/api/endpoints/createAdmin';

type SuccessResponse = ApiSuccessResponse<CreateAdminRes>;

const SuccessUserResponse: SuccessResponse = {
  success: true,
  data: {
    status: '200',
    message: 'Admin Created Successfully',
  },
};

const ErrorUserResponse: ApiErrorResponse = {
  success: false,
  error: 'Fail error response',
  code: 'INTERNAL_SERVER_ERROR',
  status: 500,
};

const CreateAdminResponse: ApiSuccessResponse<unknown> = {
  success: true,
  message: 'Successfully Admin created',
  data: null,
};

export { CreateAdminResponse, ErrorUserResponse, SuccessUserResponse };
