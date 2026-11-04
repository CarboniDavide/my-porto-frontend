import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../contexts/LanguageContext'
import { usePageSeo } from '../hooks/usePageSeo'
import {
  ArrowUpRight, BrainCircuit, Check, ChevronDown, FileSearch, Sparkles, Workflow,
  Bot, Zap, MessageSquare, Layers, Database, Code2, Rocket, Gauge, ShieldCheck,
} from 'lucide-react'
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
      <section
        className="showcase-hero relative box-border flex min-h-[calc(100svh-4rem)] items-center justify-center overflow-hidden bg-[#fffaf4] px-4 py-16 sm:px-6 sm:py-20"
        data-slide
      >
        <div className="showcase-hero-inner grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div className="showcase-copy">
            <p className="showcase-eyebrow mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#d66d28]">
              <span className="showcase-status-dot" />
              {t('showcase.eyebrow', 'AI Use Cases & Scenarios')}
            </p>
            <h1 className="showcase-title mb-6 max-w-2xl font-serif text-5xl font-bold leading-[1.04] tracking-tight text-[#1f2327] sm:text-7xl">
              {t('showcase.title', 'Explore AI in Action')}
              <span className="showcase-title-accent">.</span>
            </h1>
            <p className="mb-8 max-w-xl text-lg leading-relaxed text-[#50575d] sm:text-xl">
              {t(
                'showcase.intro',
                'Discover practical AI use cases and scenarios. Select a theme to start a focused conversation with the AI Assistant and see how these solutions can be applied to your context.'
              )}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to={`/${language}/ai-demo`}
                className="showcase-primary-cta cta-attention inline-flex items-center gap-2 rounded-full bg-[#d66d28] px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#c05e20]"
              >
                {t('hero.ctaAIExamples')}
                <ArrowUpRight className="size-4" />
              </Link>
              <Link
                to={`/${language}/portfolio`}
                className="showcase-secondary-cta inline-flex items-center rounded-full border border-[#ebdcc9] bg-white px-6 py-3.5 text-sm font-semibold text-[#1f2327] transition hover:-translate-y-0.5"
              >
                {t('nav.portfolio')}
              </Link>
            </div>
            <div className="showcase-proof mt-9 flex items-center gap-3">
              <div className="showcase-avatar-stack" aria-hidden="true">
                <span>AI</span><span>UX</span><span>DEV</span>
              </div>
              <p>{t('aiDemo.workflowEyebrow')} <strong>{t('aiDemo.preview.title')}</strong></p>
            </div>
          </div>

          <div className="showcase-product-visual" aria-label={t('aiDemo.preview.title')}>
            <div className="product-glow" aria-hidden="true" />
            <div className="product-window">
              <div className="product-window-topbar">
                <div className="product-window-dots" aria-hidden="true"><i /><i /><i /></div>
                <span>{t('aiDemo.preview.title')}</span>
                <span className="product-live"><span />{t('aiDemo.preview.status')}</span>
              </div>
              <div className="product-window-body">
                <div className="product-sidebar" aria-hidden="true">
                  <span className="product-sidebar-logo"><Workflow /></span>
                  <i className="active" /><i /><i /><i />
                </div>
                <div className="product-dashboard">
                  <div className="product-dashboard-heading">
                    <div>
                      <span className="product-kicker">{t('aiDemo.workflowEyebrow')}</span>
                      <h2>{t('aiDemo.workflowTitle')}</h2>
                    </div>
                  </div>
                  <div className="product-flow">
                    {([BrainCircuit, FileSearch, Sparkles]).map((Icon, index) => (
                      <div className="product-flow-step" key={index}>
                        <span className={`product-flow-icon tone-${index}`}><Icon /></span>
                        <span className="product-flow-label">{t(`aiDemo.steps.${index}.label`)}</span>
                        <span className="product-flow-title">{t(`aiDemo.steps.${index}.title`)}</span>
                        {index < 2 && <span className="product-flow-connector" aria-hidden="true" />}
                      </div>
                    ))}
                  </div>
                  <div className="product-insight">
                    <span className="product-insight-icon"><Check /></span>
                    <div>
                      <strong>{t('aiDemo.preview.replyLabel')}</strong>
                      <span>{t('aiDemo.preview.reply')}</span>
                    </div>
                    <ArrowUpRight className="product-insight-arrow" />
                  </div>
                </div>
              </div>
              <div className="product-floating-card">
                <span className="product-floating-icon"><Sparkles /></span>
                <span><strong>{t('aiDemo.resultEyebrow')}</strong><small>{t('aiDemo.resultTitle')}</small></span>
                <span className="product-floating-check"><Check /></span>
              </div>
            </div>
            <span className="product-orbit product-orbit-one" aria-hidden="true" />
            <span className="product-orbit product-orbit-two" aria-hidden="true" />
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-[#d66d28] hidden md:block" aria-hidden="true">
          <ChevronDown className="size-8" />
        </div>
      </section>

      {/* Theme sections */}
      {visibleThemes.map((theme, index) => {
        const icons = [BrainCircuit, FileSearch, Sparkles]
        const satellites = [
          [Bot, Zap, MessageSquare],
          [Layers, Database, Code2],
          [Rocket, Gauge, ShieldCheck],
        ]
        const Icon = icons[index % icons.length]
        const isEven = index % 2 === 0
        
        return (
          <section
            key={theme.title}
            className={`showcase-theme showcase-theme-${index + 1} exp-section exp-tone-${index + 1} box-border min-h-[calc(100svh-4rem)] flex items-center justify-center px-4 py-16 sm:px-6 sm:py-20 overflow-hidden ${
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
                  <div className={`showcase-theme-art showcase-theme-art-${index + 1}`}>
                    <span className="showcase-art-ring showcase-art-ring-1" aria-hidden="true" />
                    <span className="showcase-art-ring showcase-art-ring-2" aria-hidden="true" />
                    <span className="showcase-art-core">
                      <Icon strokeWidth={1.6} />
                    </span>
                    {satellites[index % satellites.length].map((Sat, satIndex) => (
                      <span className={`showcase-art-sat showcase-art-sat-${satIndex + 1}`} key={satIndex} aria-hidden="true">
                        <Sat strokeWidth={1.8} />
                      </span>
                    ))}
                  </div>
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
                      className="exp-chip rounded-full border border-[#ebdcc9] bg-white px-4 py-2 text-sm font-semibold"
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <div>
                  <Link
                    to={`/${language}?topic=${encodeURIComponent(theme.link)}`}
                    className="exp-cta inline-flex rounded-full bg-[#d66d28] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#c05e20]"
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
