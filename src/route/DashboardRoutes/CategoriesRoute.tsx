import { lazy } from 'react';

import { Route } from 'react-router-dom';

import ROUTES from '@/route/routesConstant';

import ProtectedRoute from '../ProtectedRoute';

const CreateCityCategoryPage = lazy(
  () => import('@/pages/Categories/CreateCityCategory')
);
const CategoryListingPage = lazy(
  () => import('@/pages/Categories/CategoryListing')
);
const CityCategoriesListingPage = lazy(
  () => import('@/pages/Categories/CityCategoriesListing')
);
const UpdateCityCategoryPage = lazy(
  () => import('@/pages/Categories/UpdateCityCategory')
);
const CreateGlobalCategories = lazy(
  () => import('@/pages/Categories/CreateGlobalCategories')
);
const UpdateGlobalCategories = lazy(
  () => import('@/pages/Categories/UpdateGlobalCategories')
);
export const CategoriesRoutes = (
  <Route path={ROUTES.Categories}>
    <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
      <Route
        path={ROUTES.CreateCategory}
        element={<CreateGlobalCategories />}
      />
    </Route>
    <Route
      element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'CITY_ADMIN']} />}
    >
      <Route
        path={ROUTES.CreateCityCategory}
        element={<CreateCityCategoryPage />}
      />
    </Route>
    <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
      <Route path={ROUTES.CategoryListing} element={<CategoryListingPage />} />
    </Route>
    <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
      <Route
        path={ROUTES.UpdateCategory}
        element={<UpdateGlobalCategories />}
      />
    </Route>
    <Route
      element={<ProtectedRoute allowedRoles={['CITY_ADMIN', 'SUPER_ADMIN']} />}
    >
      <Route
        path={ROUTES.UpdateCityCategory}
        element={<UpdateCityCategoryPage />}
      />
    </Route>
    <Route
      element={<ProtectedRoute allowedRoles={['CITY_ADMIN', 'SUPER_ADMIN']} />}
    >
      <Route
        path={ROUTES.CityCategory}
        element={<CityCategoriesListingPage />}
      />
    </Route>
  </Route>
);
