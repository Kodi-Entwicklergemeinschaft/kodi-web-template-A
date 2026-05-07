import {
  DEFAULT_BROWSER_STORAGE,
  TBrowserStorageKey,
  TBrowserStorageValue,
} from '@/config/browser';

/**
 * Saves data to browser storage (localStorage or sessionStorage).
 *
 * @param key - The key under which to store the data.
 * @param value - The data to store, which will be stringified.
 * @param storageType - The type of browser storage to use ('localStorage' or 'sessionStorage').
 *                      Defaults to the configured default browser storage.
 * @returns A boolean indicating whether the data was successfully saved.
 */
export const saveDataInBrowserStorage = <Key extends TBrowserStorageKey>(
  key: Key,
  value: TBrowserStorageValue[Key],
  storageType = DEFAULT_BROWSER_STORAGE
) => {
  try {
    const stringifiedValue =
      typeof value === 'string' ? value : JSON.stringify(value);
    const browserStore =
      storageType === 'sessionStorage' ? sessionStorage : localStorage;
    browserStore.setItem(key, stringifiedValue);
    return true;
  } catch (error) {
    console.error(`Error saving to ${storageType} key "${key}":`, error);
    return false;
  }
};

/**
 * Retrieves data from browser storage (localStorage or sessionStorage).
 *
 * @param key - The key under which the data is stored.
 * @param storageType - The type of browser storage to use ('localStorage' or 'sessionStorage').
 *                      Defaults to the configured default browser storage.
 * @returns The parsed data, or undefined if not found or failed to parse.
 */
export const getDataFromBrowserStorage = <Key extends TBrowserStorageKey>(
  key: Key,
  storageType = DEFAULT_BROWSER_STORAGE
): TBrowserStorageValue[Key] | undefined => {
  try {
    const browserStore =
      storageType === 'sessionStorage' ? sessionStorage : localStorage;
    const item = browserStore.getItem(key);
    if (!item) return undefined;
    try {
      return JSON.parse(item) as TBrowserStorageValue[Key];
    } catch {
      return item as TBrowserStorageValue[Key];
    }
  } catch (error) {
    console.error(`Error parsing ${storageType} key "${key}":`, error);
    return undefined;
  }
};

/**
 * Removes data from browser storage (localStorage or sessionStorage).
 *
 * @param keys - The keys under which the data is stored.
 * @param storageType - The type of browser storage to use ('localStorage' or 'sessionStorage').
 *                      Defaults to the configured default browser storage.
 * @returns Whether the deletion was successful.
 */
export const deleteKeysFromBrowserStorage = (
  keys: TBrowserStorageKey[],
  storageType = DEFAULT_BROWSER_STORAGE
) => {
  const browserStore =
    storageType === 'sessionStorage' ? sessionStorage : localStorage;
  try {
    keys.forEach((key) => {
      browserStore.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error(
      `Error removing ${storageType} key "${keys.join(',')}":`,
      error
    );
    return false;
  }
};

/**
 * Deletes all data from the browser storage (localStorage or sessionStorage).
 * @param  [storageType='localStorage'] - The type of browser storage to use ('localStorage' or 'sessionStorage').
 * @returns  Whether the deletion was successful.
 */
export const deleteCompleteBrowserStorage = (
  storageType = DEFAULT_BROWSER_STORAGE
) => {
  const browserStore =
    storageType === 'sessionStorage' ? sessionStorage : localStorage;
  try {
    browserStore.clear();
    return true;
  } catch (error) {
    console.error(`Error clearing ${storageType}:`, error);
    return false;
  }
};
