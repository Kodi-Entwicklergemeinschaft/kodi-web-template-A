import { useQueryClient } from '@tanstack/react-query';
import { LogOut } from 'lucide-react';
import React from 'react';

import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate } from 'react-router-dom';

import { logoutUser } from '@/api/endpoints';
import KodiLogo from '@/assets/kodi_logo.png';
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { COOKIES_KEY_NAME } from '@/config/cookie';
import useSidebarConfig from '@/hooks/useSidebarConfig';
import { deleteCookies } from '@/lib/cookieStorage';
import ROUTES from '@/route/routesConstant';
import { Header, Sidebar } from '@/shared/DashboardLayout';
import { useGlobalStore } from '@/store/useGlobalStore';

const SidebarHeader = (
  <div className="flex items-center gap-2 pt-16 pb-16 pl-3">
    <img src={KodiLogo} alt="KodiLogo" width={80} height={30} />
    <span className="text-4xl font-bold text-foreground">mein.KODI</span>
  </div>
);

const SidebarFooter = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const resetStore = useGlobalStore((state) => state.reset);
  const { t } = useTranslation();
  const logout = async () => {
    try {
      const res = await logoutUser();
      if (res.success) {
        resetStore();
        queryClient.clear();
        deleteCookies([
          COOKIES_KEY_NAME.ACCESS_TOKEN,
          COOKIES_KEY_NAME.REFRESH_TOKEN,
          COOKIES_KEY_NAME.USER_UUID,
        ]);
        navigate(ROUTES.LogIn);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <SidebarMenuItem className="hover:bg-gray-200 hover:text-gray-800 p-2">
      <SidebarMenuButton
        className="hover:bg-gray-200 hover:text-gray-800  rounded-md"
        onClick={logout}
      >
        <div className="flex gap-4">
          <div className="p-2">
            <LogOut size={28} />
          </div>
          <span className="p-2 text-lg">{t('logout')}</span>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

function DashboardWrapper() {
  const sidebarData = useSidebarConfig();
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '20rem',
          '--sidebar-width-mobile': '20rem',
        } as React.CSSProperties & Record<string, string>
      }
    >
      <main className="flex w-full h-full">
        {/* Sidebar on the left */}
        {/* TODO: ADD SIDEBAR FOOTER CONTENT */}
        <div className="z-20">
          <Sidebar
            sidebarData={sidebarData}
            sidebarHeader={SidebarHeader}
            footerChildren={<SidebarFooter />}
          />
        </div>

        {/* Right side (Header + Content) */}
        <div className="flex flex-col flex-1">
          <Header />
          {/* Main content area */}
        </div>
        <div className="w-full mt-16 p-2 custom-scrollbar">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}

export default DashboardWrapper;
