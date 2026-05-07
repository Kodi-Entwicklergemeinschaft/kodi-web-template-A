import { lazy } from 'react';

import { Route } from 'react-router-dom';

import { ListingRoute } from '@/route/DashboardRoutes/ListingRoute';
import ProtectedRoute from '@/route/ProtectedRoute';
import ROUTES from '@/route/routesConstant';

import { CategoriesRoutes } from './CategoriesRoute';
import { TilesRoutes } from './TilesRoute';

const DashboardWrapper = lazy(() => import('@/layout/DashboardWrapper'));
const AccountsPage = lazy(() => import('@/pages/Account'));
const CityAdminPage = lazy(() => import('@/pages/CityAdmin'));

const DashboardRoutes = (
  <Route
    element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'CITY_ADMIN']} />}
  >
    <Route element={<DashboardWrapper />}>
      {TilesRoutes}
      {ListingRoute}
      {CategoriesRoutes}
      <Route
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'CITY_ADMIN']} />
        }
      >
        <Route path={ROUTES.Accounts} element={<AccountsPage />} />
      </Route>

      {/* City Administrator */}
      <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
        <Route path={ROUTES.CityAdmin} element={<CityAdminPage />} />
      </Route>
    </Route>
  </Route>
);

export default DashboardRoutes;
