import { SideBarConfig } from '@/shared/type';
import { TranslationKey } from '@/translation/translation';

import { Role } from './UserRole';

export type AppSideBarConfig = SideBarConfig<TranslationKey, Role>;
