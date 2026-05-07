import { useTranslation } from 'react-i18next';
import { TOptionsBase } from 'i18next';

import { TranslationKey } from '@/translation/translation';

type TOption = TOptionsBase & Record<string, string>;

function useTypedTranslation() {
  const { t: tOrig, ...rest } = useTranslation();
  // Typed wrapper
  const t = (key: TranslationKey, options?: TOption) => tOrig(key, options);

  return { t, ...rest };
}

export default useTypedTranslation;
