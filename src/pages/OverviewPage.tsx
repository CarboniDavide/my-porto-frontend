import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../contexts/LanguageContext'
import { usePageSeo } from '../hooks/usePageSeo'
import { ChevronDown, BrainCircuit, FileSearch, Sparkles } from 'lucide-react'
import { ObserverSlidePage } from '../components/ObserverSlidePage'

type ProjectItem = { title: string; description: string; stack: string[]; link: string }

export function OverviewPage() {
  usePageSeo('showcase')
  const { t } = useTranslation('translation')
  const { language } = useLanguage()
  const themes = t('projects.items', { returnObjects: true }) as ProjectItem[]
  const visibleThemes = themes.slice(0, 3)

  return (
    <ObserverSlidePage>
      {/* Hero Section */}
      <section 
        className="relative box-border min-h-[calc(100svh-4rem)] flex items-center justify-center bg-[#fffaf4] px-4 py-16 sm:px-6 sm:py-20" 
        data-slide
      >
        <div className="w-full max-w-4xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#d66d28]">
            {t('showcase.eyebrow', 'AI Use Cases & Scenarios')}
          </p>
          <h1 className="mb-6 font-serif text-4xl font-bold text-[#1f2327] sm:text-6xl">
            {t('showcase.title', 'Explore AI in Action')}
          </h1>
          <p className="mb-8 text-lg leading-relaxed text-[#50575d] sm:text-xl">
            {t(
              'showcase.intro',
              'Discover practical AI use cases and scenarios. Select a theme to start a focused conversation with the AI Assistant and see how these solutions can be applied to your context.'
            )}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to={`/${language}`}
              className="rounded-full bg-[#d66d28] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#c05e20]"
            >
              {t('hero.ctaAI')}
            </Link>
            <Link
              to={`/${language}/portfolio`}
              className="rounded-full border border-[#ebdcc9] bg-white px-6 py-3 text-sm font-semibold text-[#1f2327] transition hover:-translate-y-0.5"
            >
              {t('nav.portfolio')}
            </Link>
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-[#d66d28] hidden md:block" aria-hidden="true">
          <ChevronDown className="size-8" />
        </div>
      </section>

      {/* Theme sections */}
      {visibleThemes.map((theme, index) => {
        const icons = [BrainCircuit, FileSearch, Sparkles]
        const Icon = icons[index % icons.length]
        const isEven = index % 2 === 0
        
        return (
          <section
            key={theme.title}
            className={`box-border min-h-[calc(100svh-4rem)] flex items-center justify-center px-4 py-16 sm:px-6 sm:py-20 overflow-hidden ${
              index > 0 ? 'border-t border-[#ebdcc9]' : ''
            } ${isEven ? 'bg-white' : 'bg-[#fdf4e8]'}`}
            data-slide
          >
            {/* Container with Flex on mobile and Grid on desktop */}
            <div className="w-full max-w-6xl flex flex-col lg:grid lg:grid-cols-2 lg:items-center gap-8 lg:gap-0">
              
              {/* Icon Box: Always on top on mobile (order-1) */}
              <div
                className={`flex items-center justify-center py-4 lg:py-10 order-1 ${
                  isEven ? 'lg:order-2' : 'lg:order-1'
                }`}
              >
                  <Icon className="size-40 sm:size-56 lg:[&_.lucide]:size-[10rem] text-[#d66d28] drop-shadow-lg" />
              </div>

              {/* Text Box: Always on bottom on mobile (order-2) */}
              <div
                className={`flex flex-col justify-center p-2 sm:p-10 lg:p-12 order-2 ${
                  isEven 
                    ? 'lg:order-1 lg:border-r lg:border-[#ebdcc9]' 
                    : 'lg:order-2 lg:border-l lg:border-[#ebdcc9]'
                }`}
              >
                <h3 className="mb-6 font-serif text-3xl font-bold text-[#1f2327] sm:text-4xl">
                  {theme.title}
                </h3>
                <p className="mb-8 text-lg leading-relaxed text-[#50575d] sm:text-xl">
                  {theme.description}
                </p>
                <div className="mb-8 flex flex-wrap gap-3">
                  {theme.stack.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-[#ebdcc9] bg-[#fdf4e8] px-4 py-2 text-sm font-medium text-[#50575d]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <div>
                  <Link
                    to={`/${language}?topic=${encodeURIComponent(theme.link)}`}
                    className="inline-flex rounded-full bg-[#d66d28] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#c05e20]"
                  >
                    {t('projects.cta')}
                  </Link>
                </div>
              </div>

            </div>
          </section>
        )
      })}
    </ObserverSlidePage>
  )
}
