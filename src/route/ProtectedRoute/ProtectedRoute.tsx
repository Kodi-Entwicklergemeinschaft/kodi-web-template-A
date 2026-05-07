import { useMemo } from 'react';

import { Navigate, Outlet } from 'react-router-dom';

import { RoleName, USER_ROLE_MAP } from '@/lib/constant';
import ROUTES from '@/route/routesConstant';
import { selectUserRole } from '@/store/slices/userSlice';
import { useGlobalStore } from '@/store/useGlobalStore';

interface ProtectedRouteProps {
  allowedRoles: RoleName[];
  redirectTo?: string;
}

const ProtectedRoute = ({
  allowedRoles,
  redirectTo = ROUTES.LogIn,
}: ProtectedRouteProps) => {
  const userRole = useGlobalStore(selectUserRole);
  const allowedRolesValues = useMemo(
    () => allowedRoles.map((role) => USER_ROLE_MAP[role]),
    [allowedRoles]
  );

  if (!userRole) return <Navigate to={redirectTo} replace />;

  const hasAccess = allowedRolesValues.includes(userRole);

  if (!hasAccess) return <Navigate to={ROUTES.Unauthorized} replace />;

  return <Outlet />;
};

export default ProtectedRoute;
