import { http } from 'msw';

import appConfig from '@/config/appConfig';
import { error, sleep, success } from '@/mocks/utils/helper';

const { apiBaseUrl } = appConfig;

const DEFAULT_DELAY = 500;

/**
 * Creates a typed MSW handler for an API endpoint.
 *
 * @param endpoint - e.g. 'user' or 'auth/login'
 * @param method - HTTP method ('get', 'post', 'put', 'delete', etc.)
 * @param mockedResp - The mocked JSON response data
 * @param type - 'success' | 'error'
 * @param delay - Optional artificial delay (ms)
 */
export function fetchApi<T, Ttype extends 'success' | 'error' = 'success'>(
  endpoint: string,
  method: keyof typeof http,
  mockedResp: T,
  type: Ttype,
  delay: number = DEFAULT_DELAY,
  errorCode: number = 500
) {
  const url = `${apiBaseUrl}${endpoint}`;

  return http[method](url, async () => {
    try {
      if (delay) await sleep(delay);

      if (type === 'error') {
        return error(mockedResp as string, errorCode);
      }

      return success(mockedResp);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
    } catch (err) {
      return error('Unexpected mock handler failure', errorCode);
    }
  });
}
