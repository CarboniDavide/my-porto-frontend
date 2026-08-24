import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../contexts/LanguageContext'
import { SUPPORTED_LANGUAGES } from '../i18n/index'
import logoUrl from '../assets/logo.svg' 

export function Navbar() {
  const { pathname, search } = useLocation()
  const navigate = useNavigate()
  const { lang: routeLanguage } = useParams()
  const [langOpen, setLangOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!langOpen) return
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [langOpen])
  const { t } = useTranslation('translation')
  const { language, setLanguage } = useLanguage()
  const currentLanguage = SUPPORTED_LANGUAGES.includes(routeLanguage as (typeof SUPPORTED_LANGUAGES)[number])
    ? (routeLanguage as (typeof SUPPORTED_LANGUAGES)[number])
    : language
  const pathSegments = pathname.split('/').filter(Boolean)
  const currentSection = pathSegments[1] ?? ''

  function withLanguage(path: string, lang = currentLanguage) {
    const normalizedPath = path.startsWith('/') ? path.slice(1) : path
    return normalizedPath ? `/${lang}/${normalizedPath}` : `/${lang}`
  }

  function handleLanguageChange(nextLanguage: (typeof SUPPORTED_LANGUAGES)[number]) {
    const sectionPath = currentSection ? `/${currentSection}` : ''
    setLanguage(nextLanguage)
    navigate(`${withLanguage(sectionPath, nextLanguage)}${search}`)
    setLangOpen(false)
  }

  const NAV_LINKS = [
    { to: withLanguage('/'), label: t('nav.aiAssistant'), active: currentSection === '' },
    { to: withLanguage('/showcase'), label: t('nav.showcase'), active: currentSection === 'showcase' },
    { to: withLanguage('/experiences'), label: t('nav.experiences'), active: currentSection === 'experiences' },
    { to: withLanguage('/portfolio'), label: t('nav.portfolio'), active: currentSection === 'portfolio' },
    { to: withLanguage('/contact'), label: t('nav.contact'), active: currentSection === 'contact' },
    { to: withLanguage('/recruit-me'), label: t('recruitMe.title'), active: currentSection === 'recruit-me' },
  ]

  return (
    <nav className="w-full px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
      {/* Single row on desktop: logo left | links centered | lang right */}
      <div className="relative flex items-center justify-between py-3">
          {/* Logo — left */}
          <Link to={withLanguage('/')} className="flex items-center gap-2.5 shrink-0 group">
            <img src={logoUrl} alt="Logo" width="40" height="40" className="block" />
            <span className="font-serif text-base font-bold text-[#1f2327] tracking-tight sm:text-xl">
              Carboni
            </span>
          </Link>

          {/* Nav links — center (hidden on mobile, shown inline on desktop) */}
          <ul className="hidden lg:absolute lg:left-1/2 lg:flex lg:-translate-x-1/2 lg:items-center lg:gap-1">
            {NAV_LINKS.map(({ to, label, active }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={[
                    'block whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                    active
                      ? 'bg-[#d66d28] text-white'
                      : 'text-[#50575d] hover:bg-[#ebdcc9]',
                  ].join(' ')}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right side: lang + burger */}
          <div className="flex items-center justify-end gap-2 ml-auto">
            {/* Language switcher */}
            <div ref={langRef} className="relative">
              <button
                type="button"
                onClick={() => setLangOpen((o) => !o)}
                aria-expanded={langOpen}
                aria-label={t('language.label')}
                className="flex items-center gap-1.5 rounded-full border border-[#ebdcc9] bg-[#f5ece0] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#50575d] transition hover:bg-[#ebdcc9]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4">
                  <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-1.503.204A6.5 6.5 0 1 1 10 3.5c.731 0 1.434.12 2.09.34-.504.09-.987.27-1.425.536a3.48 3.48 0 0 0-.99 3.48c.097.344.158.706.175 1.08a6.43 6.43 0 0 0-.483 1.25C9 10.694 9 11.122 9 11.5c0 .572.114 1.116.32 1.611A5.484 5.484 0 0 1 8.5 15c0 .782.17 1.525.475 2.194A6.47 6.47 0 0 1 3.5 10a6.47 6.47 0 0 1 .386-2.19c.553.34 1.13.646 1.732.912.128.056.258.108.39.157.14.33.245.676.31 1.038.102.567.131 1.155.058 1.733-.065.518-.256 1.006-.512 1.45l.6.346c.323-.56.564-1.173.641-1.818.083-.657.051-1.327-.065-1.965a7.02 7.02 0 0 0-.239-.8 12.505 12.505 0 0 1-1.615-.818A6.494 6.494 0 0 1 8 3.535v.381c0 .593-.1 1.162-.284 1.694l-.124.353.938.334.124-.354C8.841 5.348 9 4.682 9 3.985v-.45A6.5 6.5 0 0 1 16.497 10.204ZM10 14.5c0-.386.05-.76.143-1.116A3.5 3.5 0 1 1 10 14.5Z" clipRule="evenodd" />
                </svg>
                {language}
              </button>

              {langOpen && (
                <div className="absolute right-0 top-full mt-1.5 flex flex-col overflow-hidden rounded-xl border border-[#ebdcc9] bg-[#fffaf4] shadow-lg">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => handleLanguageChange(lang)}
                      className={[
                        'px-4 py-2 text-left text-xs font-bold uppercase tracking-wider transition',
                        lang === language
                          ? 'bg-[#d66d28] text-white'
                          : 'text-[#50575d] hover:bg-[#f5ece0]',
                      ].join(' ')}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Burger button — mobile only */}
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-label="Menu"
              className="flex size-9 items-center justify-center rounded-full border border-[#ebdcc9] bg-[#f5ece0] text-[#50575d] transition hover:bg-[#ebdcc9] lg:hidden"
            >
              {menuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                  <path fillRule="evenodd" d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75ZM2 10a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Zm0 5.25a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu — collapsible */}
        {menuOpen && (
          <ul className="flex flex-col gap-1 pb-3 lg:hidden bg-[#fffaf4] border border-[#ebdcc9] rounded-xl mx-2 mt-2 shadow-lg px-4 py-3">
            {NAV_LINKS.map(({ to, label, active }) => (
              <li key={to}>
                <Link
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={[
                    'block whitespace-nowrap rounded-full px-3 py-2 text-xs font-semibold transition-colors',
                    active
                      ? 'bg-[#d66d28] text-white'
                      : 'text-[#50575d] hover:bg-[#ebdcc9]',
                  ].join(' ')}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        )}
    </nav>
  )
}

