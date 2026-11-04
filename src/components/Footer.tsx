import { Link, useLocation, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../contexts/LanguageContext'
import { type Language, SUPPORTED_LANGUAGES } from '../i18n'

function isSupportedLanguage(value: string | undefined): value is Language {
  return SUPPORTED_LANGUAGES.includes(value as Language)
}

export function Footer() {
  const { t } = useTranslation('translation')
  const { language } = useLanguage()
  const { pathname } = useLocation()
  const { lang } = useParams()
  const year = new Date().getFullYear()
  const normalizedPath = pathname.replace(/\/+$/, '') || '/'
  const isChatRoute = isSupportedLanguage(lang) && normalizedPath === `/${lang}`

  if (isChatRoute) {
    return null
  }

  return (
    <footer className="border-t border-[#ebdcc9] bg-[#fffaf4]/90">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-6 sm:px-6 sm:py-7 lg:flex-row lg:items-center lg:justify-between">
        <nav aria-label="Footer" className="flex flex-wrap items-center gap-2">
          <Link
            to={`/${language}/legal?doc=terms`}
            className="rounded-full border border-[#ebdcc9] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#50575d] transition hover:border-[#d66d28] hover:text-[#1f2327]"
          >
            {t('footer.terms')}
          </Link>
          <Link
            to={`/${language}/legal?doc=privacy`}
            className="rounded-full border border-[#ebdcc9] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#50575d] transition hover:border-[#d66d28] hover:text-[#1f2327]"
          >
            {t('footer.privacy')}
          </Link>
          <Link
            to={`/${language}/legal?doc=legal_notice`}
            className="rounded-full border border-[#ebdcc9] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#50575d] transition hover:border-[#d66d28] hover:text-[#1f2327]"
          >
            {t('footer.legalNotice')}
          </Link>
        </nav>

        <div className="flex flex-col gap-2 text-sm text-[#7d7f80] sm:items-end">
          <p>{t('footer.copyright', { year })}</p>
        </div>
      </div>
    </footer>
  )
}
