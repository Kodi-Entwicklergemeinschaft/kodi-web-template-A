import Cookies from 'js-cookie';

/**
 * Set Type of Data in cookie
 * @param {String} key
 * @param {String} value
 * @param {Number} expireInDays
 */
export const setDataInCookie = (
  key: string,
  value: string,
  expireInDays: number
) => {
  Cookies.set(key, value, { expires: expireInDays, secure: true });
};

/**
 * Get Cookie Stored Data by providing key name
 * @param key
 * @returns {undefined | String}
 */
export const getDataFromCookie = (key: string): undefined | string => {
  if (!key) return undefined;
  const value = Cookies.get(key);
  if (!value) return undefined;

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

/**
 * Remove Set of Cookies
 * @param keys
 */
export const removeCookies = (keys: string[]) => {
  keys.forEach((key) => Cookies.remove(key));
};
