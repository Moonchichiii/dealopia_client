import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslation from './locales/en/common.json';
import esTranslation from './locales/es/common.json';
import frTranslation from './locales/fr/common.json';
import deTranslation from './locales/de/common.json';
import itTranslation from './locales/it/common.json';
import ptTranslation from './locales/pt/common.json';
import plTranslation from './locales/pl/common.json';

// Initialize i18next
i18n
  .use(initReactI18next) // Passes i18n down to react-i18next
  .use(LanguageDetector) // Detects user language
  .init({
    resources: {
      en: {
        common: enTranslation,
      },
      es: {
        common: esTranslation,
      },
      fr: {
        common: frTranslation,
      },
      de: {
        common: deTranslation,
      },
      it: {
        common: itTranslation,
      },
      pt: {
        common: ptTranslation,
      },
      pl: {
        common: plTranslation,
      }
    },
    fallbackLng: 'en',
    ns: ['common'],
    defaultNS: 'common',
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
