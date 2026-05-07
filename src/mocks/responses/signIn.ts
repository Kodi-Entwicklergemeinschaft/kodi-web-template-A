import { ApiErrorResponse, ApiSuccessResponse } from '@/api/api.type';
import { SignInUserResponse } from '@/api/endpoints';

type SuccessResponse = ApiSuccessResponse<SignInUserResponse>;

const SuccessUserResponse: SuccessResponse = {
  success: true,
  data: {
    user: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'user@example.com',
      username: 'johnDoe',
      role: 1,
      userType: 'REGISTERED',
      firstName: 'John',
      lastName: 'Doe',
    },
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    expiresIn: 900,
    requiresTermsAcceptance: true,
    termsId: '123e4567-e89b-12d3-a456-426614174000',
    latestVersion: '2024-01',
    gracePeriodEndsAt: '2024-01-08T00:00:00.000Z',
  },
  message: 'Successfully Signed In',
};

const ErrorUserResponse: ApiErrorResponse = {
  success: false,
  error: 'Wrong Password',
  code: 'INTERNAL_SERVER_ERROR',
  status: 401,
};

const LogoutUserResponse: ApiSuccessResponse<unknown> = {
  success: true,
  message: 'Successfully Signed Out',
  data: null,
};

export { ErrorUserResponse, LogoutUserResponse, SuccessUserResponse };
