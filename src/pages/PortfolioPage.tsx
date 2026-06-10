import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../contexts/LanguageContext'
import { usePageSeo } from '../hooks/usePageSeo'
import {
  ChevronDown, Code2, Layers, Server, Cloud, Database, Container, Layout
} from 'lucide-react'
import { ObserverSlidePage } from '../components/ObserverSlidePage'

type SkillCategory = { name: string; items: string[] }

const CATEGORY_ICONS = [Code2, Layers, Server, Cloud, Database, Container, Layout]

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

  return (
    <ObserverSlidePage>

      {/* Hero */}
      <section className="relative box-border flex items-center justify-center bg-white px-4 py-16 sm:px-6 sm:py-20 h-auto min-h-[60vh] md:h-[calc(100svh-4rem)]" data-slide>
        <div className="w-full max-w-4xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#d66d28]">{t('nav.portfolio')}</p>
          <h1 className="mb-6 font-serif text-4xl font-bold text-[#1f2327] sm:text-6xl">{t('skills.title')}</h1>
          <p className="mb-8 text-lg leading-relaxed text-[#50575d] sm:text-xl">{t('skills.text')}</p>
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

      {/* One section per skill category */}
      {skills.map((category, index) => {
        const Icon = CATEGORY_ICONS[index % CATEGORY_ICONS.length]
        const isEven = index % 2 === 0
        const isEvenSection = (index + 1) % 2 === 0

        return (
          <section
            key={category.name}
            className={`box-border flex items-center justify-center border-t border-[#ebdcc9] px-4 py-16 sm:px-6 sm:py-20 h-auto min-h-[60vh] md:h-[calc(100svh-4rem)] ${
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
                <Icon className="size-40 text-[#d66d28] sm:size-80 opacity-90" />
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
                <p className="mb-8 max-w-3xl text-base leading-relaxed text-[#50575d] sm:text-lg">
                  {getCategorySummary(category.items)}
                </p>
                <div className="flex flex-wrap gap-3">
                  {category.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-[#ebdcc9] bg-white px-4 py-2 text-sm font-bold uppercase tracking-tight text-[#d66d28] shadow-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )
      })}

      {/* 4. Approach + Cloud */}
      <section className="box-border flex items-center justify-center border-t border-white/10 bg-[#1f2327] px-4 py-20 min-h-[calc(100svh-4rem)] text-white" data-slide>
        <div className="w-full max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            
            {/* Box Approccio */}
            <div className="group relative overflow-hidden rounded-3xl bg-white/5 p-8 sm:p-12 border border-white/10 transition-all hover:bg-white/10">
              <div className="relative z-10">
                <div className="mb-6 inline-flex size-12 items-center justify-center rounded-xl bg-[#d66d28]/20 text-[#d66d28]">
                  <Layers className="size-6" />
                </div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#d66d28]">
                  {t('skills.approach.title')}
                </p>
                <h2 className="mb-5 font-serif text-3xl font-bold text-[#ebdcc9]">
                  {t('skills.approach.title')}
                </h2>
                <p className="text-base leading-relaxed text-gray-400">
                  {t('skills.approach.text')}
                </p>
              </div>
              {/* Decorazione di sfondo */}
              <div className="absolute -right-8 -top-8 size-32 rounded-full bg-[#d66d28]/10 blur-3xl transition-all group-hover:bg-[#d66d28]/20" />
            </div>

            {/* Box Cloud */}
            <div className="group relative overflow-hidden rounded-3xl bg-white/5 p-8 sm:p-12 border border-white/10 transition-all hover:bg-white/10">
              <div className="relative z-10">
                <div className="mb-6 inline-flex size-12 items-center justify-center rounded-xl bg-[#d66d28]/20 text-[#d66d28]">
                  <Cloud className="size-6" />
                </div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#d66d28]">
                  {t('skills.cloud.title')}
                </p>
                <h2 className="mb-5 font-serif text-3xl font-bold text-[#ebdcc9]">
                  {t('skills.cloud.title')}
                </h2>
                <p className="text-base leading-relaxed text-gray-400">
                  {t('skills.cloud.text')}
                </p>
              </div>
              {/* Decorazione di sfondo */}
              <div className="absolute -right-8 -top-8 size-32 rounded-full bg-[#d66d28]/10 blur-3xl transition-all group-hover:bg-[#d66d28]/20" />
            </div>

          </div>
        </div>
      </section>

    </ObserverSlidePage>
  )
}