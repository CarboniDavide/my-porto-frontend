import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import en from './locales/en.json'
import fr from './locales/fr.json'
import it from './locales/it.json'

export const SUPPORTED_LANGUAGES = ['en', 'it', 'fr'] as const
export type Language = (typeof SUPPORTED_LANGUAGES)[number]

export const LANGUAGE_STORAGE_KEY = 'portfolio-language'

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      it: { translation: it },
      fr: { translation: fr },
    },
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGUAGES,
    interpolation: {
      // React already escapes values — no need to double-escape
      escapeValue: false,
    },
    detection: {
      order: ['path', 'localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupFromPathIndex: 0,
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
    },
  })

export default i18n
