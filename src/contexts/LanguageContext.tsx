import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { SUPPORTED_LANGUAGES, type Language } from '../i18n/index'

type LanguageContextValue = {
  language: Language
  setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation('translation')
  const currentLanguage = i18n.resolvedLanguage ?? i18n.language

  const language = (SUPPORTED_LANGUAGES.includes(currentLanguage as Language)
    ? currentLanguage
    : 'en') as Language

  const setLanguage = useCallback((lang: Language) => {
    if (i18n.resolvedLanguage === lang || i18n.language === lang) {
      document.documentElement.lang = lang
      return
    }

    void i18n.changeLanguage(lang)
    document.documentElement.lang = lang
  }, [i18n])

  const contextValue = useMemo(() => ({ language, setLanguage }), [language, setLanguage])

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider')
  return ctx
}
