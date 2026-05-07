import { initReactI18next } from 'react-i18next';
import { getDataFromBrowserStorage } from '@lib/browserStorage';
import SupportedLanguage from '@local-type/SupportedLang';
import i18n from 'i18next';

import rawAr from '@/translation/ar.json';
import rawDe from '@/translation/de.json';
import rawDk from '@/translation/dk.json';
import rawEn from '@/translation/en.json';
import rawFa from '@/translation/fa.json';
import rawNo from '@/translation/no.json';
import rawRu from '@/translation/ru.json';
import rawSe from '@/translation/se.json';
import rawTr from '@/translation/tr.json';
import { TranslationSchema } from '@/translation/translation';
import rawUk from '@/translation/uk.json';

const loadTranslation = <T extends TranslationSchema>(data: T) => data;

const en = loadTranslation(rawEn);
const de = loadTranslation(rawDe);
const dk = loadTranslation(rawDk);
const no = loadTranslation(rawNo);
const se = loadTranslation(rawSe);
const ar = loadTranslation(rawAr);
const fa = loadTranslation(rawFa);
const tr = loadTranslation(rawTr);
const ru = loadTranslation(rawRu);
const uk = loadTranslation(rawUk);

const fallbackLng = 'de';
const defaultLanguage = getDataFromBrowserStorage('i18nextLng') || fallbackLng;
const resources: Record<SupportedLanguage, { translation: TranslationSchema }> =
  {
    en: { translation: en },
    de: { translation: de },
    dk: { translation: dk },
    no: { translation: no },
    se: { translation: se },
    ar: { translation: ar },
    fa: { translation: fa },
    tr: { translation: tr },
    ru: { translation: ru },
    uk: { translation: uk },
  };

i18n.use(initReactI18next).init({
  resources,
  lng: defaultLanguage,
  fallbackLng,
  defaultNS: 'translation',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
