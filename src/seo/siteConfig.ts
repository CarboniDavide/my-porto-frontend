import { type Language, SUPPORTED_LANGUAGES } from '../i18n'

export const SITE_URL = 'https://www.carboni.ch'
export const SITE_NAME = 'Davide Carboni'
export const DEFAULT_OG_IMAGE = '/favicon.svg'

export const SEO_ROUTE_PATHS = {
  chat: '',
  showcase: 'showcase',
  'ai-demo': 'ai-demo',
  portfolio: 'portfolio',
  experiences: 'experiences',
  contact: 'contact',
  'recruit-me': 'recruit-me',
} as const

export type SeoRouteKey = keyof typeof SEO_ROUTE_PATHS

export function buildLocalizedPath(language: Language, route: SeoRouteKey): string {
  const routePath = SEO_ROUTE_PATHS[route]
  return routePath ? `/${language}/${routePath}` : `/${language}`
}

export function toAbsoluteUrl(pathname: string): string {
  return new URL(pathname, SITE_URL).toString()
}

export function getAlternates(route: SeoRouteKey) {
  return SUPPORTED_LANGUAGES.map((language) => ({
    hrefLang: language,
    href: toAbsoluteUrl(buildLocalizedPath(language, route)),
  }))
}

export function getLocaleForOg(language: Language): string {
  switch (language) {
    case 'it':
      return 'it_IT'
    case 'fr':
      return 'fr_FR'
    default:
      return 'en_US'
  }
}
