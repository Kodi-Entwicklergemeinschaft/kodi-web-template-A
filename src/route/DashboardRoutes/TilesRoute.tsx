import { lazy } from 'react';

import { Route } from 'react-router-dom';

import ROUTES from '@/route/routesConstant';

import ProtectedRoute from '../ProtectedRoute';

const TileUploadPage = lazy(() => import('@/pages/Tiles/TileUpload'));
const TileListingPage = lazy(() => import('@/pages/Tiles/TileListings'));

export const TilesRoutes = (
  <Route path={ROUTES.Tiles}>
    <Route
      element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'CITY_ADMIN']} />}
    >
      <Route path={ROUTES.UploadTile} element={<TileUploadPage />} />
      <Route path={ROUTES.EditTile} element={<TileUploadPage />} />
    </Route>
    <Route
      element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'CITY_ADMIN']} />}
    >
      <Route path={ROUTES.TileListing} element={<TileListingPage />} />
    </Route>
  </Route>
);
