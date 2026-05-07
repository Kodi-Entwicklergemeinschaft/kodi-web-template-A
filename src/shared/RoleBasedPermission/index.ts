import { RoleValue } from '@/lib/constant';
import { USER_ROLE_MAP } from '@/lib/constant';
type Permission = {
  role: RoleValue;
  canEdit: boolean;
  canDelete: boolean;
};
export const PermissionsMap: Record<RoleValue, Permission> = {
  [USER_ROLE_MAP.SUPER_ADMIN]: {
    role: USER_ROLE_MAP.SUPER_ADMIN,
    canEdit: true, //canEditTile
    canDelete: true, //canDeleteTile
  },
  [USER_ROLE_MAP.CITY_ADMIN]: {
    role: USER_ROLE_MAP.CITY_ADMIN,
    canEdit: true,
    canDelete: false,
  },
  [USER_ROLE_MAP.CITIZEN]: {
    role: USER_ROLE_MAP.CITIZEN,
    canEdit: false,
    canDelete: false,
  },
};
