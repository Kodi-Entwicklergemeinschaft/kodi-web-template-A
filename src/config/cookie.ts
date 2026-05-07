import Cookies from 'node_modules/@types/js-cookie';

import appConfig from './appConfig';

const COOKIE_CONFIG: Cookies.CookieAttributes = {
  secure: appConfig.environmentMode === 'production',
  sameSite: 'lax',
  path: '/',
};

export const COOKIES_KEY_NAME = {
  ACCESS_TOKEN: 'accessToken',
  USER_UUID: 'userUid',
  REFRESH_TOKEN: 'refreshToken',
} as const;

type TCookieNameValue = typeof COOKIES_KEY_NAME;

/**
 * The type for the cookie name.
 * - It is a union of all the values of the `COOKIES_KEY_NAME` object.
 * - It is used to type the cookie name.
 */
export type TCookieName = TCookieNameValue[keyof TCookieNameValue];

/**
 * The type for the cookie value.
 * - It is a record with all the values of the `COOKIES_KEY_NAME` object as keys.
 * - It is used to type the cookie value.
 */
export type TCookieValue = {
  [COOKIES_KEY_NAME.ACCESS_TOKEN]: string;
  [COOKIES_KEY_NAME.USER_UUID]: string;
  [COOKIES_KEY_NAME.REFRESH_TOKEN]: string;
};

export default COOKIE_CONFIG;
