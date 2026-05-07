import { useMemo } from 'react';

import { SIDEBAR_CONFIG } from '@/config/sidebar';
import { ROLE_USER_MAP } from '@/lib/constant';
import { selectUserRole } from '@/store/slices/userSlice';
import { useGlobalStore } from '@/store/useGlobalStore';
import { AppSideBarConfig } from '@/type';

const useSidebarConfig = (): AppSideBarConfig[] => {
  const userRole = useGlobalStore(selectUserRole);

  const memoizedConfig = useMemo(() => {
    if (!userRole) return [];

    const normalizedRole = ROLE_USER_MAP[userRole] || userRole;

    return SIDEBAR_CONFIG.reduce<AppSideBarConfig[]>((acc, item) => {
      if (!item.active) return acc;

      const filteredChildren = item.children
        ? item.children.filter(
            (child) =>
              child.active && child.permittedRole.includes(normalizedRole)
          )
        : undefined;

      // Include item if its role matches OR if it has permitted children
      if (
        item.permittedRole.includes(normalizedRole) ||
        (filteredChildren && filteredChildren.length > 0)
      ) {
        acc.push({
          ...item,
          children: filteredChildren,
        });
      }

      return acc;
    }, []);
  }, [userRole]);

  return memoizedConfig;
};

export default useSidebarConfig;
