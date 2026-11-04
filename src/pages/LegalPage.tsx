import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../contexts/LanguageContext'
import { usePageSeo } from '../hooks/usePageSeo'

const DOCS = [
  { param: 'terms', key: 'terms', label: 'footer.terms' },
  { param: 'privacy', key: 'privacy', label: 'footer.privacy' },
  { param: 'legal_notice', key: 'notice', label: 'footer.legalNotice' },
] as const

type LegalSection = { title: string; body: string[]; recaptcha?: boolean }

export function LegalPage() {
  usePageSeo('legal')
  const { t } = useTranslation('translation')
  const { language } = useLanguage()
  const [searchParams] = useSearchParams()
  const current = DOCS.find((doc) => doc.param === searchParams.get('doc')) ?? DOCS[1]
  const sections = t(`legal.docs.${current.key}.sections`, { returnObjects: true }) as LegalSection[]

  return (
    <main className="px-4 py-12 sm:px-6 sm:py-16">
      <article className="mx-auto w-full max-w-3xl">
        <nav aria-label="Legal" className="mb-8 flex flex-wrap gap-2">
          {DOCS.map((doc) => (
            <Link
              key={doc.param}
              to={`/${language}/legal?doc=${doc.param}`}
              aria-current={doc.param === current.param ? 'page' : undefined}
              className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                doc.param === current.param
                  ? 'border-[#d66d28] bg-[#d66d28] text-white'
                  : 'border-[#ebdcc9] bg-white text-[#50575d] hover:border-[#d66d28] hover:text-[#1f2327]'
              }`}
            >
              {t(doc.label)}
            </Link>
          ))}
        </nav>

        <p className="mb-3 text-sm text-[#7d7f80]">{t('legal.updated')}</p>
        <h1 className="mb-8 font-serif text-3xl font-bold text-[#1f2327] sm:text-5xl">
          {t(`legal.docs.${current.key}.title`)}
        </h1>

        {sections.map((section, index) => (
          <section key={`${index}-${section.title}`} className="mb-8">
            {section.title && (
              <h2 className="mb-3 font-serif text-xl font-bold text-[#1f2327] sm:text-2xl">{section.title}</h2>
            )}
            {section.body.map((paragraph, pIndex) => (
              <p key={paragraph} className="mb-3 text-base leading-relaxed text-[#50575d]">
                {paragraph}
                {section.recaptcha && pIndex === section.body.length - 1 && (
                  <>
                    {' '}
                    {t('footer.googleNotice')}{' '}
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="underline">
                      Privacy Policy
                    </a>{' '}
                    ·{' '}
                    <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer" className="underline">
                      Terms of Service
                    </a>
                  </>
                )}
              </p>
            ))}
          </section>
        ))}


        <p className="mt-10 border-t border-[#ebdcc9] pt-6 text-base leading-relaxed text-[#50575d]">
          {t('legal.contactLine')}
        </p>
      </article>
    </main>
  )
}
