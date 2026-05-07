import SupportedLanguage from '@local-type/SupportedLang';

import appConfig from './appConfig';

export const DEFAULT_BROWSER_STORAGE = appConfig.browserStorageMethod;

export const BROWSER_STORAGE_KEYS = {
  /**
   * Key for storing the default language in the browser storage.
   * @description
   * The value is used to determine the language of the application.
   * If the value is not set, the default language is 'en'.
   */
  DEFAULT_LANGUAGE: 'i18nextLng',
  /**
   * Key for storing the global store in the browser storage.
   * @description
   * The global store is used to store the state of the application.
   * The value is used to determine the state of the application.
   */
  GLOBAL_STORE: 'global-store',
} as const;

type TBrowserStorageKeyObject = typeof BROWSER_STORAGE_KEYS;
export type TBrowserStorageKey =
  TBrowserStorageKeyObject[keyof TBrowserStorageKeyObject];

export type TBrowserStorageValue = {
  [BROWSER_STORAGE_KEYS.DEFAULT_LANGUAGE]: SupportedLanguage;
  [BROWSER_STORAGE_KEYS.GLOBAL_STORE]: string;
};
