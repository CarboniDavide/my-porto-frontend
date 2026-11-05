import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../contexts/LanguageContext'
import { usePageSeo } from '../hooks/usePageSeo'
import {
  ChevronDown, Server, Database, Container, Layout, Terminal, GitBranch, Workflow, Code2, Layers, Sparkles, Compass,
  Network, Palette, MonitorSmartphone, MousePointerClick, ClipboardList, CalendarCheck, Target, Users,
  MessageCircle, TrendingUp, ShieldCheck, type LucideIcon,
} from 'lucide-react'
import { ObserverSlidePage } from '../components/ObserverSlidePage'

type SkillCategory = { name: string; text?: string; items: string[] }
type PortfolioSection = { name: string; text?: string; paragraphs?: string[]; items?: string[]; art: { main: LucideIcon; sats: LucideIcon[] } }

const APPROACH_ART = { main: Compass, sats: [Layers, Sparkles, Code2] }

// Ordine allineato a skills.categories: backend, frontend, qualità/DevOps, project management
const CATEGORY_ART: { main: LucideIcon; sats: LucideIcon[] }[] = [
  { main: Server, sats: [Database, Network, Terminal] },
  { main: Layout, sats: [Palette, MonitorSmartphone, MousePointerClick] },
  { main: Container, sats: [GitBranch, Workflow, ShieldCheck] },
  { main: ClipboardList, sats: [CalendarCheck, Target, Users] },
]

const PILLAR_ICONS: LucideIcon[] = [MessageCircle, TrendingUp, ShieldCheck]

function renderInline(text: string) {
  return text.split(/(\*\*.+?\*\*|\*.+?\*)/g).map((part, index) => {
    if (part.startsWith('**')) return <strong key={index} className="font-semibold text-[#1f2327]">{part.slice(2, -2)}</strong>
    if (part.startsWith('*')) return <em key={index}>{part.slice(1, -1)}</em>
    return <span key={index}>{part}</span>
  })
}

function getCategorySummary(items: string[]): string {
  const preview = items.slice(0, 3).join(', ')
  const suffix = items.length > 3 ? ', ...' : ''
  return `${preview}${suffix}`
}

export function PortfolioPage() {
  usePageSeo('portfolio')
  const { t } = useTranslation('translation')
  const { language } = useLanguage()
  const skills = t('skills.categories', { returnObjects: true }) as SkillCategory[]
  const pillars = t('skills.pillars', { returnObjects: true }) as { title: string; text: string }[]
  const sections: PortfolioSection[] = [
    { name: t('skills.approach.title'), paragraphs: t('skills.approach.text').split('\n'), art: APPROACH_ART },
    ...skills.map((category, index) => ({ ...category, art: CATEGORY_ART[index % CATEGORY_ART.length] })),
  ]

  return (
    <ObserverSlidePage>

      {/* Hero */}
      <section className="relative box-border flex items-center justify-center bg-white px-4 py-16 sm:px-6 sm:py-20 h-auto min-h-[60vh] md:h-[calc(100svh-4rem)]" data-slide>
        <div className="w-full max-w-4xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#d66d28]">{t('nav.portfolio')}</p>
          <h1 className="mb-6 font-serif text-4xl font-bold text-[#1f2327] sm:text-6xl">{t('skills.title')}</h1>
          {t('skills.text').split('\n').map((paragraph, pIndex) => (
            <p key={pIndex} className="mb-4 text-justify text-lg leading-relaxed text-[#50575d] last:mb-8 sm:text-xl">
              {paragraph.split(/\*\*(.+?)\*\*/g).map((part, index) =>
                index % 2 === 1 ? (
                  <strong key={index} className="font-semibold text-[#1f2327]">{part}</strong>
                ) : (
                  <span key={index}>{part}</span>
                ),
              )}
            </p>
          ))}
          <div className="flex flex-wrap gap-3">
            <Link
              to={`/${language}/showcase`}
              className="rounded-full border border-[#ebdcc9] bg-white px-6 py-3 text-sm font-semibold text-[#1f2327] transition hover:-translate-y-0.5"
            >
              {t('nav.showcase')}
            </Link>
            <Link
              to={`/${language}`}
              className="rounded-full bg-[#d66d28] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#c05e20]"
            >
              {t('hero.ctaAI')}
            </Link>
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-[#d66d28] hidden md:block" aria-hidden="true">
          <ChevronDown className="size-8" />
        </div>
      </section>

      {/* Pillars */}
      <section className="box-border flex items-center justify-center border-t border-[#ebdcc9] bg-[#fdf4e8] px-4 py-16 sm:px-6 sm:py-20 min-h-[60vh] md:h-[calc(100svh-4rem)]" data-slide>
        <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-3 lg:gap-8">
          {pillars.map((pillar, index) => {
            const Icon = PILLAR_ICONS[index % PILLAR_ICONS.length]
            return (
              <div key={pillar.title} className={`portfolio-card pillar-card-${(index % 3) + 1} relative overflow-hidden rounded-3xl p-8 sm:p-10`}>
                <div className="portfolio-card-icon mb-6 inline-flex size-12 items-center justify-center rounded-xl">
                  <Icon className="size-6" />
                </div>
                <h2 className="mb-4 font-serif text-2xl font-bold">{pillar.title}</h2>
                <p className="text-justify text-base leading-relaxed">{pillar.text}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Approach + one section per skill category */}
      {sections.map((category, index) => {
        const art = category.art
        const Main = art.main
        const isEven = index % 2 === 0
        const isEvenSection = (index + 1) % 2 === 0
        const heightClass = category.paragraphs
          ? 'md:min-h-[calc(100svh-4rem)]'
          : 'md:h-[calc(100svh-4rem)]'

        return (
          <section
            key={category.name}
            className={`exp-section exp-tone-${(index % 6) + 1} box-border flex items-center justify-center border-t border-[#ebdcc9] px-4 py-16 sm:px-6 sm:py-20 h-auto min-h-[60vh] ${heightClass} ${
              isEven ? 'bg-white' : 'bg-[#fdf4e8]'
            }`}
            data-slide
          >
            <div className="w-full max-w-6xl lg:grid lg:grid-cols-2 lg:items-stretch">

              {/* Icon Container - Centrato anche su mobile */}
              <div
                className={`flex min-h-[250px] items-center justify-center p-10 ${
                  isEvenSection ? 'lg:order-2' : 'lg:order-1'
                }`}
              >
                <div className={`showcase-theme-art showcase-theme-art-${(index % 6) + 1}`} aria-hidden="true">
                  <span className="showcase-art-ring showcase-art-ring-1" />
                  <span className="showcase-art-ring showcase-art-ring-2" />
                  <span className="showcase-art-core">
                    <Main strokeWidth={1.6} />
                  </span>
                  {art.sats.map((Sat, satIndex) => (
                    <span className={`showcase-art-sat showcase-art-sat-${satIndex + 1}`} key={satIndex}>
                      <Sat strokeWidth={1.8} />
                    </span>
                  ))}
                </div>
              </div>

              {/* Text Content - Linea di separazione dinamica */}
              <div
                className={`flex flex-col justify-center p-8 sm:p-10 lg:p-12 ${
                  isEvenSection 
                    ? 'lg:order-1 lg:border-r lg:border-[#ebdcc9]' 
                    : 'lg:order-2 lg:border-l lg:border-[#ebdcc9]'
                }`}
              >
                <h2 className="mb-4 font-serif text-3xl font-bold text-[#1f2327] sm:text-4xl">{category.name}</h2>
                {category.paragraphs ? (
                  category.paragraphs.map((paragraph, pIndex) => (
                    <p key={pIndex} className="mb-4 text-justify text-base leading-relaxed text-[#50575d] last:mb-0 sm:text-lg">
                      {renderInline(paragraph)}
                    </p>
                  ))
                ) : (
                  <>
                    <p className="mb-8 max-w-3xl text-justify text-base leading-relaxed text-[#50575d] sm:text-lg">
                      {category.text ?? getCategorySummary(category.items ?? [])}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {(category.items ?? []).map((item) => (
                        <span
                          key={item}
                          className="exp-chip rounded-full border border-[#ebdcc9] bg-white px-4 py-2 text-sm font-bold uppercase tracking-tight text-[#d66d28] shadow-sm"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>
        )
      })}


    </ObserverSlidePage>
  )
}
