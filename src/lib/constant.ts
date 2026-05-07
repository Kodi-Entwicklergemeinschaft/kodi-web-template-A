export const USER_ROLE_MAP = {
  SUPER_ADMIN: 1,
  CITY_ADMIN: 2,
  CITIZEN: 3,
} as const;

export const ROLE_USER_MAP = {
  '1': 'SUPER_ADMIN',
  '2': 'CITY_ADMIN',
  '3': 'CITIZEN',
} as const;

export type RoleName = keyof typeof USER_ROLE_MAP;
export type RoleValue = (typeof USER_ROLE_MAP)[RoleName];

export const SUCCESS_STATUS = 200;
export const UN_AUTHORIZED_STATUS = 401;
export const SESSION_EXPIRED = 403;
export const USER_CREATED = 201;

export const TABLE_PAGE_SIZE = 10;

export const QUERY_PERSISTENT_MAX_AGE = 1000 * 60 * 5; // 5 minute

export const MAX_FILE_SIZE = 15;
