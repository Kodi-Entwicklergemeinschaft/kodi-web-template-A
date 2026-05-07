import { RoleValue } from '@/lib/constant';
import { USER_ROLE_MAP } from '@/lib/constant';

type Permission = {
  canEdit: boolean;
  canDelete: boolean;
};

export const PermissionsMap: Record<RoleValue, Permission> = {
  [USER_ROLE_MAP.SUPER_ADMIN]: {
    canEdit: true,
    canDelete: true,
  },
  [USER_ROLE_MAP.CITY_ADMIN]: {
    canEdit: true,
    canDelete: false,
  },
  [USER_ROLE_MAP.CITIZEN]: {
    canEdit: false,
    canDelete: false,
  },
};
