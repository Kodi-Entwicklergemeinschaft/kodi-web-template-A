import { ApiErrorResponse, ApiSuccessResponse } from '@/api/api.type';
import { RegisterUserResponse } from '@/api/endpoints';
import { USER_ROLE_MAP } from '@/lib/constant';

type SuccessResponse = ApiSuccessResponse<RegisterUserResponse>;

const RegisterSuccessResponse: SuccessResponse = {
  success: true,
  data: {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'user@example.com',
    username: 'johnDoe',
    firstName: 'John',
    lastName: 'Doe',
    role: USER_ROLE_MAP.SUPER_ADMIN,
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  message: 'Successfully Registered',
};

const RegisterErrorResponse: ApiErrorResponse = {
  success: false,
  error: 'Registration Failed',
  code: 'INTERNAL_SERVER_ERROR',
  status: 500,
};

export { RegisterErrorResponse, RegisterSuccessResponse };
