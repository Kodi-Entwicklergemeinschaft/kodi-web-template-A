export {};
import 'react-i18next';

import type { TranslationSchema } from './translation/translation';

declare module 'react-i18next' {
  interface Resources {
    translation: TranslationSchema;
  }
  interface DefaultNamespace extends string {
    default: 'translation';
  }
}
