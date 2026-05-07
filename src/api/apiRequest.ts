import type { AxiosError, AxiosRequestConfig } from 'axios';
import axios from 'axios';

import appConfig from '@/config/appConfig';
import { BROWSER_STORAGE_KEYS } from '@/config/browser';
import { COOKIES_KEY_NAME } from '@/config/cookie';
import { getDataFromBrowserStorage } from '@/lib/browserStorage';
import {
  SUCCESS_STATUS,
  UN_AUTHORIZED_STATUS,
  USER_CREATED,
} from '@/lib/constant';
import { deleteCookies } from '@/lib/cookieStorage';
import { saveDataInCookie } from '@/lib/cookieStorage';
import { getDataFromCookie } from '@/lib/cookieUtils';

import { ApiErrorResponse, ApiResponse, ApiSuccessResponse } from './/api.type';
import API_URLS from './apiURl';

const VALID_STATUS = [SUCCESS_STATUS, USER_CREATED];

let isRefreshing = false;

axios.defaults.baseURL = appConfig.apiBaseUrl;

// This Will add Cookie in HTTPS Request
axios.defaults.withCredentials = appConfig.environmentMode === 'production';

axios.interceptors.request.use(
  (config) => {
    const initialHeader = config.headers['Content-Type'];
    const configCopy = { ...config };
    const accessToken = getDataFromCookie(COOKIES_KEY_NAME.ACCESS_TOKEN);
    if (accessToken) {
      configCopy.headers.Authorization = `Bearer ${accessToken}`;
    }
    configCopy.headers.Accept = '*/*';
    configCopy.headers['Content-Type'] = initialHeader || 'application/json';
    configCopy.headers['Access-Control-Expose-Headers'] =
      'X-Pagination-Current-Page, X-Pagination-Total-Count';
    const lang =
      getDataFromBrowserStorage(BROWSER_STORAGE_KEYS.DEFAULT_LANGUAGE) || 'de';
    config.headers['Accept-Language'] = lang;
    return configCopy;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === UN_AUTHORIZED_STATUS &&
      !originalRequest._retry
    ) {
      console.warn('Unauthorized request, attempting token refresh.');

      // Prevent multiple refresh attempts
      if (isRefreshing) {
        return Promise.reject(error);
      }
      isRefreshing = true;
      const refreshToken =
        getDataFromCookie(COOKIES_KEY_NAME.REFRESH_TOKEN) ?? '';
      // Remove any surrounding quotes from the token
      if (!refreshToken) {
        console.warn('No refresh token available, logging out user.');
        localStorage.clear();
        sessionStorage.clear();
        deleteCookies([
          COOKIES_KEY_NAME.ACCESS_TOKEN,
          COOKIES_KEY_NAME.REFRESH_TOKEN,
        ]);
        return Promise.reject(error);
      }
      const res = await axios.post<
        ApiSuccessResponse<{ accessToken: string; refreshToken: string }>
      >(API_URLS.RefreshToken, { refreshToken });
      const newToken = res?.data?.data;
      if (newToken) {
        // Retry the failed request with the new token
        originalRequest._retry = true;
        originalRequest.headers.Authorization = `Bearer ${newToken.accessToken}`;
        saveDataInCookie(COOKIES_KEY_NAME.ACCESS_TOKEN, newToken.accessToken);
        saveDataInCookie(COOKIES_KEY_NAME.REFRESH_TOKEN, newToken.refreshToken);
        isRefreshing = false;
        return axios(originalRequest);
      } else {
        console.warn('Token refresh failed, logging out user.');
        localStorage.clear();
        sessionStorage.clear();
        deleteCookies([
          COOKIES_KEY_NAME.ACCESS_TOKEN,
          COOKIES_KEY_NAME.REFRESH_TOKEN,
        ]);
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

const apiRequest = async <TResponse = unknown, TData = unknown>(
  data: AxiosRequestConfig<TData> & {
    showResultMessage?: boolean;
    showErrorMessage?: boolean;
  }
): Promise<ApiResponse<TResponse>> => {
  try {
    const response = await axios<ApiResponse<TResponse>>(data);

    if (VALID_STATUS.includes(response.status)) {
      if (data.showResultMessage) console.log('✅ Success Message');
    }

    return response.data;
  } catch (axiosError) {
    const err = axiosError as AxiosError<{ message?: string; code?: string }>;

    if (data.showErrorMessage) {
      console.log('❌ Show Error Popup Message');
    }

    const normalized: ApiErrorResponse = {
      success: false,
      error: err.response?.data?.message || err.message || 'Unknown error',
      code: err.response?.data?.code,
      status: err.response?.status,
    };

    return normalized;
  }
};

export default apiRequest;
