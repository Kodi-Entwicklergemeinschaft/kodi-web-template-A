import { lazy } from 'react';

import { Navigate, Route, Routes } from 'react-router-dom';

import Dummy from '@/pages/Dummy';
import { UnauthorizedPage } from '@/pages/Unauthorized';
import AuthRoutes from '@/route/AuthRoutes';
import DashboardRoutes from '@/route/DashboardRoutes';
import ROUTES from '@/route/routesConstant';

const TermsConditions = lazy(() => import('@/pages/TermsConditions'));
const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy'));

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path={ROUTES.Default}
        element={<Navigate to={ROUTES.LogIn} replace />}
      />
      {/* ELEMENT: Auth Routes */}
      {AuthRoutes}
      <Route path={ROUTES.Unauthorized} element={<UnauthorizedPage />} />
      <Route path={ROUTES.Dummy} element={<Dummy />} />

      <Route path={ROUTES.PrivacyPolicy} element={<PrivacyPolicy />} />
      <Route path={ROUTES.TermsConditions} element={<TermsConditions />} />

      {/* ELEMENT: Shared Dashboard for all logged-in users */}
      {DashboardRoutes}

      <Route path={ROUTES.NotFound} element={<>404 Not Found</>} />
    </Routes>
  );
}
