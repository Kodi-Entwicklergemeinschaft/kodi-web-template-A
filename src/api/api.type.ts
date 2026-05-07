type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  message?: string;
  status?: number;
};

type ApiErrorResponse = {
  success: false;
  error: string;
  code?: string;
  status?: number;
};

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export type { ApiErrorResponse, ApiResponse, ApiSuccessResponse };
