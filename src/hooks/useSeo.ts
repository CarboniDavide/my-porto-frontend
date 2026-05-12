import { useEffect } from 'react'
import { SITE_NAME, SITE_URL } from '../seo/siteConfig'

type AlternateLink = {
  hrefLang: string
  href: string
}

type UseSeoOptions = {
  title: string
  description: string
  language: string
  canonicalUrl: string
  imageUrl: string
  keywords?: string
  robots?: string
  ogType?: 'website' | 'article'
  ogLocale?: string
  alternates?: AlternateLink[]
}

function upsertMeta(metaKey: 'name' | 'property', metaValue: string, content: string) {
  const selector = `meta[${metaKey}="${metaValue}"]`
  let element = document.head.querySelector(selector) as HTMLMetaElement | null

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(metaKey, metaValue)
    element.setAttribute('data-seo-managed', 'true')
    document.head.append(element)
  }

  element.setAttribute('content', content)
}

function upsertCanonical(url: string) {
  let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null

  if (!canonical) {
    canonical = document.createElement('link')
    canonical.rel = 'canonical'
    canonical.setAttribute('data-seo-managed', 'true')
    document.head.append(canonical)
  }

  canonical.href = url
}

function replaceAlternates(alternates: AlternateLink[]) {
  const previousAlternates = document.head.querySelectorAll('link[rel="alternate"][data-seo-managed="true"]')
  previousAlternates.forEach((element) => element.remove())

  alternates.forEach(({ hrefLang, href }) => {
    const alternate = document.createElement('link')
    alternate.rel = 'alternate'
    alternate.hreflang = hrefLang
    alternate.href = href
    alternate.setAttribute('data-seo-managed', 'true')
    document.head.append(alternate)
  })
}

function upsertStructuredData(title: string, description: string, canonicalUrl: string, language: string) {
  let script = document.getElementById('seo-structured-data') as HTMLScriptElement | null

  if (!script) {
    script = document.createElement('script')
    script.id = 'seo-structured-data'
    script.type = 'application/ld+json'
    script.setAttribute('data-seo-managed', 'true')
    document.head.append(script)
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: canonicalUrl,
    inLanguage: language,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
  }

  script.textContent = JSON.stringify(schema)
}

export function useSeo({
  title,
  description,
  language,
  canonicalUrl,
  imageUrl,
  keywords,
  robots = 'index, follow',
  ogType = 'website',
  ogLocale,
  alternates = [],
}: UseSeoOptions) {
  useEffect(() => {
    document.title = title
    document.documentElement.lang = language

    upsertMeta('name', 'description', description)
    upsertMeta('name', 'robots', robots)

    if (keywords) {
      upsertMeta('name', 'keywords', keywords)
    }

    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:type', ogType)
    upsertMeta('property', 'og:url', canonicalUrl)
    upsertMeta('property', 'og:image', imageUrl)
    upsertMeta('property', 'og:site_name', SITE_NAME)

    if (ogLocale) {
      upsertMeta('property', 'og:locale', ogLocale)
    }

    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', imageUrl)

    upsertCanonical(canonicalUrl)

    const defaultAlternate = alternates.find((alternate) => alternate.hrefLang === 'en')
    replaceAlternates([
      ...alternates,
      { hrefLang: 'x-default', href: defaultAlternate?.href ?? canonicalUrl },
    ])
    upsertStructuredData(title, description, canonicalUrl, language)

  }, [alternates, canonicalUrl, description, imageUrl, keywords, language, ogLocale, ogType, robots, title])
}
