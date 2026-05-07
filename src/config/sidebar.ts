import {
  Building2,
  FolderTree,
  LayoutDashboard,
  LayoutList,
  List,
  Plus,
  Upload,
  Users,
} from 'lucide-react';

import ROUTES from '@/route/routesConstant';
import { AppSideBarConfig } from '@/type';

export const SIDEBAR_CONFIG: AppSideBarConfig[] = [
  {
    name: 'sidebar.listingManagement.title',
    logo: LayoutList,
    link: ROUTES.Listings,
    permittedRole: ['SUPER_ADMIN'],
    active: true,
    children: [
      {
        name: 'sidebar.listingManagement.upload',
        logo: Upload,
        link: `${ROUTES.Listings}/${ROUTES.UploadListing}`,
        permittedRole: ['SUPER_ADMIN'],
        active: true,
      },
      {
        name: 'sidebar.listingManagement.listing',
        logo: List,
        link: `${ROUTES.Listings}/${ROUTES.Lists}`,
        permittedRole: ['SUPER_ADMIN'],
        active: true,
      },
    ],
  },
  {
    name: 'sidebar.tileManagement.title',
    logo: LayoutDashboard,
    link: ROUTES.Dashboard,
    permittedRole: ['SUPER_ADMIN', 'CITY_ADMIN'],
    active: true,
    children: [
      {
        name: 'sidebar.tileManagement.upload',
        logo: Upload,
        link: `${ROUTES.Tiles}/${ROUTES.UploadTile}`,
        permittedRole: ['SUPER_ADMIN', 'CITY_ADMIN'],
        active: true,
      },
      {
        name: 'sidebar.tileManagement.listing',
        logo: List,
        link: `${ROUTES.Tiles}/${ROUTES.TileListing}`,
        permittedRole: ['SUPER_ADMIN', 'CITY_ADMIN'],
        active: true,
      },
    ],
  },
  {
    name: 'sidebar.categoryManagement.title',
    logo: FolderTree,
    link: ROUTES.Categories,
    permittedRole: ['SUPER_ADMIN', 'CITY_ADMIN'],
    active: true,
    children: [
      {
        name: 'sidebar.categoryManagement.create',
        logo: Plus,
        link: `${ROUTES.Categories}/${ROUTES.CreateCityCategory}`,
        permittedRole: ['SUPER_ADMIN'],
        active: true,
      },
      // {
      //   name: 'sidebar.categoryManagement.listing',
      //   logo: List,
      //   link: `${ROUTES.Categories}/${ROUTES.CategoryListing}`,
      //   permittedRole: ['SUPER_ADMIN'],
      //   active: true,
      // },
      {
        name: 'sidebar.categoryManagement.cityCategory',
        logo: List,
        link: `${ROUTES.Categories}/${ROUTES.CityCategory}`,
        permittedRole: ['CITY_ADMIN', 'SUPER_ADMIN'],
        active: true,
      },
    ],
  },
  {
    name: 'sidebar.accounts.title',
    logo: Users,
    link: ROUTES.Accounts,
    permittedRole: ['SUPER_ADMIN', 'CITY_ADMIN'],
    active: true,
  },
  {
    name: 'sidebar.cityAdmin.title',
    logo: Building2,
    link: ROUTES.CityAdmin,
    permittedRole: ['SUPER_ADMIN'],
    active: true,
  },
];
