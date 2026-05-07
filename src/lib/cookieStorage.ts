import Cookies from 'js-cookie';

import COOKIE_CONFIG, {
  COOKIES_KEY_NAME,
  TCookieName,
  TCookieValue,
} from '@/config/cookie';

/**
 * Saves data in a cookie.
 *
 * @param cookieName - The name of the cookie to set.
 * @param cookieValue - The value to store in the cookie. It will be stringified before saving.
 * @returns A promise that resolves when the cookie is set.
 */
export const saveDataInCookie = async <CookieName extends TCookieName>(
  cookieName: CookieName,
  cookieValue: TCookieValue[CookieName]
) => {
  const stringifiedCookieValue = JSON.stringify(cookieValue);
  Cookies.set(cookieName, stringifiedCookieValue, COOKIE_CONFIG);
  return true;
};

/**
 * Deletes the specified cookies. If no cookie names are provided,
 * all cookies managed by this library are deleted.
 *
 * @param cookieNames - The names of the cookies to delete.
 * @returns A promise that resolves when the cookies are deleted.
 */
export const deleteCookies = async (cookieNames?: TCookieName[]) => {
  let names: TCookieName[] | undefined = cookieNames;
  if (!names) {
    names = Object.values(COOKIES_KEY_NAME) as TCookieName[];
  }
  names.forEach((cookieName) => Cookies.remove(cookieName));
  return true;
};

/**
 * Retrieves data from a cookie.
 *
 * @param cookieName - The name of the cookie to get.
 * @returns A promise that resolves with the parsed cookie value if it exists or undefined if it does not.
 */
export const getCookies = async <CookieName extends TCookieName>(
  cookieName: CookieName
): Promise<TCookieValue[CookieName] | undefined> => {
  const value = Cookies.get(cookieName);
  if (value) {
    try {
      return JSON.parse(value);
    } catch (err) {
      console.error(err);
      return undefined;
    }
  }
};
