import { Route } from 'react-router-dom';

import AllListings from '@/pages/Listings/AllListings';
import ListFormUpload from '@/pages/Listings/ListFormUpload';
import ListUpdate from '@/pages/Listings/ListUpdate';
import ROUTES from '@/route/routesConstant';

import ProtectedRoute from '../ProtectedRoute';

export const ListingRoute = (
  <Route path={ROUTES.Listings}>
    <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
      <Route path={ROUTES.UploadListing} element={<ListFormUpload />} />
      <Route path={ROUTES.UpdateListing} element={<ListUpdate />} />
    </Route>
    <Route
      element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'CITY_ADMIN']} />}
    >
      <Route path={ROUTES.Lists} element={<AllListings />} />
    </Route>
  </Route>
);
