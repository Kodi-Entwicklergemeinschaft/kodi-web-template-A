import React from 'react';

import { SidebarProvider } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { AppSideBarConfig } from '@/type';

import { Header } from './Header';
import { Sidebar } from './Sidebar';

const SidebarHeader = (
  <div className="flex items-center gap-2 pt-16 pb-16 pl-3">
    <Skeleton className="h-16 w-16 rounded-full" />
    <Skeleton className="h-8 w-full mb-2 rounded-md" />
  </div>
);

type DashboardSkeletonProps = {
  sidebarData: AppSideBarConfig[];
};
export function DashboardSkeleton({ sidebarData }: DashboardSkeletonProps) {
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
        <div className="z-20">
          <Sidebar
            isLoading
            sidebarData={sidebarData}
            sidebarHeader={SidebarHeader}
            footerChildren={
              <Skeleton className="h-10 w-full mb-2 rounded-md" />
            }
          />
        </div>

        {/* Right side (Header + Content) */}
        <div className="flex flex-col flex-1">
          <Header isLoading />
          {/* Main content area */}
        </div>
        <div className="w-full mt-16 p-2 custom-scrollbar">
          <Skeleton className="h-8 w-1/4 mb-4" />
          <Skeleton className="h-8 w-1/6 mb-4" />
        </div>
      </main>
    </SidebarProvider>
  );
}
