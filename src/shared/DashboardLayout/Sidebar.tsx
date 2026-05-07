import { ChevronDown } from 'lucide-react';
import React from 'react';

import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Sidebar as ShadCnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu as ShadCnSidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { SideBarConfig } from '@/shared/type';
import { Role } from '@/type';

type SideBarProps<
  TranslationKey extends string,
  TRole extends Role,
  TDataConfig extends SideBarConfig<TranslationKey, TRole>,
> = {
  sidebarData: TDataConfig[];
  sidebarHeader: React.ReactNode;
  footerChildren?: React.ReactNode;
  isLoading?: boolean;
};

function Sidebar<
  TranslationKey extends string,
  TRole extends Role,
  TDataConfig extends SideBarConfig<TranslationKey, TRole>,
>({
  sidebarData,
  sidebarHeader,
  footerChildren,
  isLoading,
}: SideBarProps<TranslationKey, TRole, TDataConfig>) {
  return (
    <ShadCnSidebar
      role="navigation"
      aria-label="Sidebar menu"
      variant="sidebar"
    >
      <SidebarContent className="custom-scrollbar">
        <SidebarGroup className="flex justify-between h-full">
          <div>
            <SidebarGroupLabel asChild>{sidebarHeader}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu sidebarData={sidebarData} isLoading={isLoading} />
            </SidebarGroupContent>
          </div>
          {footerChildren && (
            <div>
              <SidebarSeparator />
              <SidebarFooter className=" bottom-0 rounded-lg">
                <ShadCnSidebarMenu>{footerChildren}</ShadCnSidebarMenu>
              </SidebarFooter>
            </div>
          )}
        </SidebarGroup>
      </SidebarContent>
    </ShadCnSidebar>
  );
}

Sidebar.displayName = 'Sidebar';

type SidebarMenuProps<
  TranslationKey extends string,
  TRole extends Role,
  TDataConfig extends SideBarConfig<TranslationKey, TRole>,
> = {
  sidebarData: TDataConfig[];
  isLoading?: boolean;
};
const SidebarMenu = <
  TranslationKey extends string,
  TRole extends Role,
  TDataConfig extends SideBarConfig<TranslationKey, TRole>,
>({
  sidebarData,
  isLoading,
}: SidebarMenuProps<TranslationKey, TRole, TDataConfig>) => {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <ShadCnSidebarMenu className="w-full p-2">
      {sidebarData?.map((item) =>
        item.children?.length ? (
          <li key={item.name}>
            <Collapsible defaultOpen className="group/collapsible">
              <ul>
                <SidebarMenuItem>
                  <CollapsibleTrigger className="flex w-full gap-1">
                    <div className="p-2">
                      {isLoading ? (
                        <Skeleton className="h-8 w-8 rounded-sm" />
                      ) : (
                        <item.logo size={28} />
                      )}
                    </div>
                    {isLoading ? (
                      <Skeleton className="p-2 mt-2 h-8 w-full rounded-sm" />
                    ) : (
                      <span className="p-2  md:text-lg">{t(item.name)}</span>
                    )}
                    {!isLoading && (
                      <ChevronDown className="mt-2 ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.children.map((subitem) => (
                        <SidebarMenuSubItem
                          key={`${t(subitem.name)}-${subitem.link}`}
                          onClick={() => {
                            if (isLoading) return;
                            navigate(subitem.link);
                          }}
                          className={cn(
                            pathname.startsWith(subitem.link)
                              ? 'bg-primary text-primary-foreground border rounded-md cursor-pointer'
                              : 'hover:bg-gray-200 hover:text-gray-800 cursor-pointer rounded-md'
                          )}
                        >
                          <MenuContent item={subitem} isLoading={isLoading} />
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </ul>
            </Collapsible>
          </li>
        ) : (
          <SidebarMenuItem
            key={item.name}
            onClick={() => {
              if (isLoading) return;
              navigate(item.link);
            }}
            className={cn(
              pathname.startsWith(item.link)
                ? 'bg-primary text-primary-foreground border rounded-md cursor-pointer'
                : 'hover:bg-gray-200 hover:text-gray-800 cursor-pointer rounded-md'
            )}
          >
            <MenuContent
              item={item}
              containerClassName="gap-4"
              contentClassName="text-lg"
              isLoading={isLoading}
            />
          </SidebarMenuItem>
        )
      )}
    </ShadCnSidebarMenu>
  );
};

SidebarMenu.displayName = 'SidebarMenu';

type MenuContentProps<
  TranslationKey extends string,
  TRole extends Role,
  TDataConfig extends SideBarConfig<TranslationKey, TRole>,
> = {
  item: TDataConfig;
  containerClassName?: string;
  contentClassName?: string;
  isLoading?: boolean;
};
const MenuContent = <
  TranslationKey extends string,
  TRole extends Role,
  TDataConfig extends SideBarConfig<TranslationKey, TRole>,
>({
  item: { name, logo: Icon },
  contentClassName,
  containerClassName,
  isLoading,
}: MenuContentProps<TranslationKey, TRole, TDataConfig>) => {
  const { t } = useTranslation();
  return (
    <div className={cn('flex', containerClassName)}>
      <div className="p-2">
        {isLoading ? (
          <Skeleton className="h-8 w-8 rounded-sm" />
        ) : (
          <Icon size={20} className="mt-0" />
        )}
      </div>
      {isLoading ? (
        <Skeleton className="p-2 mt-2 h-8 w-full rounded-sm" />
      ) : (
        <span className={cn('p-2', contentClassName)}>{t(name)}</span>
      )}
    </div>
  );
};

MenuContent.displayName = 'MenuContent';

export { MenuContent, Sidebar, SidebarMenu };
