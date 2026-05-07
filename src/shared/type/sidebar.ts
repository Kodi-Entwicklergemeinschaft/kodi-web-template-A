import { LucideIcon } from 'lucide-react';

export type SideBarConfig<
  TranslationKey extends string,
  TRole extends string,
> = {
  name: TranslationKey;
  logo: LucideIcon;
  link: string;
  permittedRole: TRole[];
  active: boolean;
  children?: SideBarConfig<TranslationKey, TRole>[];
};
