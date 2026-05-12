import { useEffect } from 'react'
import { Navigate, Outlet, useParams } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { type Language, SUPPORTED_LANGUAGES } from '../i18n'
import { Footer } from './Footer'
import { Header } from './Header'

function isSupportedLanguage(value: string | undefined): value is Language {
  return SUPPORTED_LANGUAGES.includes(value as Language)
}

function SyncLanguageFromUrl() {
  const { lang } = useParams()
  const { setLanguage } = useLanguage()

  useEffect(() => {
    if (!isSupportedLanguage(lang)) return
    setLanguage(lang)
    document.documentElement.lang = lang
  }, [lang, setLanguage])

  return null
}

export function LocalizedLayout() {
  const { lang } = useParams()

  if (!isSupportedLanguage(lang)) {
    return <Navigate to="/en" replace />
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SyncLanguageFromUrl />
      <Header />
      <main id="content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
