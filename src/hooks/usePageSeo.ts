import { useTranslation } from 'react-i18next'
import { useLanguage } from '../contexts/LanguageContext'
import { useSeo } from './useSeo'
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  buildLocalizedPath,
  getAlternates,
  getLocaleForOg,
  toAbsoluteUrl,
  type SeoRouteKey,
} from '../seo/siteConfig'

const PAGE_TRANSLATION_KEYS: Record<SeoRouteKey, { title: string; description: string }> = {
  chat: {
    title: 'seo.chat.title',
    description: 'seo.chat.description',
  },
  showcase: {
    title: 'seo.showcase.title',
    description: 'seo.showcase.description',
  },
  portfolio: {
    title: 'seo.portfolio.title',
    description: 'seo.portfolio.description',
  },
  contact: {
    title: 'seo.contact.title',
    description: 'seo.contact.description',
  },
  'recruit-me': {
    title: 'recruitMe.title',
    description: 'recruitMe.subtitle',
  },
}

export function usePageSeo(route: SeoRouteKey) {
  const { t } = useTranslation('translation')
  const { language } = useLanguage()
  const localizedPath = buildLocalizedPath(language, route)
  const canonicalUrl = toAbsoluteUrl(localizedPath)
  const title = `${t(PAGE_TRANSLATION_KEYS[route].title)} | ${SITE_NAME}`
  const description = t(PAGE_TRANSLATION_KEYS[route].description)

  useSeo({
    title,
    description,
    language,
    canonicalUrl,
    imageUrl: toAbsoluteUrl(DEFAULT_OG_IMAGE),
    keywords: t('seo.keywords'),
    ogLocale: getLocaleForOg(language),
    alternates: getAlternates(route),
  })
}
