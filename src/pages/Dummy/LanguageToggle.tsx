import { useEffect, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { saveDataInBrowserStorage } from '@/lib/browserStorage';
import SupportedLanguage from '@/type/SupportedLang';

type AllLanguage = { code: SupportedLanguage; name: string };

const ALL_LANGUAGES: AllLanguage[] = [
  { code: 'de', name: 'Deutsch' },
  { code: 'en', name: 'English' },
];

function LanguageToggle() {
  const { i18n } = useTranslation<'translation'>();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const currentLanguage = useMemo(
    () => ALL_LANGUAGES.find((lang) => lang.code === i18n.language),
    [i18n.language]
  );

  const changeLanguage = (lang: SupportedLanguage) => {
    i18n.changeLanguage(lang);
    saveDataInBrowserStorage('i18nextLng', lang);
  };

  return (
    <div>
      <span>Current Lang : {currentLanguage?.name}</span>
      <Button
        onClick={() => {
          changeLanguage('en');
        }}
      >
        English
      </Button>
      <Button
        onClick={() => {
          changeLanguage('de');
        }}
      >
        Deutsch
      </Button>
    </div>
  );
}

export default LanguageToggle;
