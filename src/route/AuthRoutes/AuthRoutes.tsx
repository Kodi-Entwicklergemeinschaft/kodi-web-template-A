import { lazy } from 'react';

import { Route } from 'react-router-dom';

import ROUTES from '@/route/routesConstant';

const SignInPage = lazy(() => import('@/pages/SignIn/SignIn'));
const AuthWrapper = lazy(() => import('@/layout/AuthWrapper'));
const RegisterPage = lazy(() => import('@/pages/Register'));
const ResetPasswordPage = lazy(() => import('@/pages/ResetPassword'));

const AuthRoutes = (
  <Route>
    <Route element={<AuthWrapper heading="signIntoAccount" />}>
      <Route path={ROUTES.LogIn} element={<SignInPage />} />
    </Route>

    <Route element={<AuthWrapper heading="createAccount" />}>
      <Route path={ROUTES.Register} element={<RegisterPage />} />
    </Route>

    <Route element={<AuthWrapper heading="resetPassword" />}>
      <Route path={ROUTES.ResetPasswordToken} element={<ResetPasswordPage />} />
    </Route>
  </Route>
);

export default AuthRoutes;
