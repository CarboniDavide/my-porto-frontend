import { useTranslation } from 'react-i18next'
import { usePageSeo } from '../hooks/usePageSeo'
import {
  ChevronDown, Building2, Landmark, Code2, Database, Rocket, Layers, GitBranch, Server,
  BookOpen, Globe, Newspaper, Boxes, Terminal, Puzzle, Music, Wrench, Palette, UtensilsCrossed, Users, Star, Coffee,
  type LucideIcon,
} from 'lucide-react'
import { ObserverSlidePage } from '../components/ObserverSlidePage'

const artSets: { main: LucideIcon; sats: LucideIcon[] }[] = [
  { main: Landmark, sats: [Building2, Code2, Users] },
  { main: Layers, sats: [Server, Database, GitBranch] },
  { main: Newspaper, sats: [BookOpen, Globe, Rocket] },
  { main: Boxes, sats: [Terminal, Puzzle, Database] },
  { main: Music, sats: [Wrench, Palette, Code2] },
  { main: UtensilsCrossed, sats: [Coffee, Users, Star] },
]

type ExperienceItem = { role: string; company: string; period: string; bullets: string[] }

function renderBulletText(bullet: string) {
  const parts = bullet.split(/(dclics\.ch|journee-mmt\.ch)/gi)

  return parts.map((part, index) => {
    const lower = part.toLowerCase()
    if (lower === 'dclics.ch' || lower === 'journee-mmt.ch') {
      return (
        <a
          key={`${part}-${index}`}
          href={`https://${part}`}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-[#d66d28] underline decoration-[#d66d28]/60 underline-offset-2 hover:text-[#c05e20]"
        >
          {part}
        </a>
      )
    }

    return <span key={`${part}-${index}`}>{part}</span>
  })
}

export function ExperiencesPage() {
  usePageSeo('experiences')
  const { t } = useTranslation('translation')
  const experiences = t('experiences.items', { returnObjects: true }) as ExperienceItem[]

  return (
    <ObserverSlidePage>
      <section className="relative box-border flex items-center justify-center bg-[#fffaf4] px-4 py-16 sm:px-6 sm:py-20 h-auto min-h-[60vh] md:h-[calc(100svh-4rem)]" data-slide>
        <div className="w-full max-w-4xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#d66d28]">{t('nav.experiences')}</p>
          <h1 className="mb-6 font-serif text-4xl font-bold text-[#1f2327] sm:text-6xl">{t('experiences.title')}</h1>
          <p className="mb-8 max-w-3xl text-lg leading-relaxed text-[#50575d] sm:text-xl">{t('experiences.text')}</p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#experience-0"
              className="rounded-full border border-[#ebdcc9] bg-white px-6 py-3 text-sm font-semibold text-[#1f2327] transition hover:-translate-y-0.5"
            >
              {t('experiences.ctaExperience')}
            </a>
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-[#d66d28] hidden md:block" aria-hidden="true">
          <ChevronDown className="size-8" />
        </div>
      </section>

      {experiences.map((item, index) => {
        const isEven = index % 2 === 0
        const isEvenSection = (index + 1) % 2 === 0

        return (
          <section
            id={`experience-${index}`}
            key={`${item.company}-${item.period}`}
            className={`exp-section exp-tone-${(index % 6) + 1} box-border flex items-center justify-center border-t border-[#ebdcc9] px-4 py-16 sm:px-6 sm:py-20 h-auto min-h-[60vh] md:h-[calc(100svh-4rem)] ${
              isEven ? 'bg-white' : 'bg-[#fdf4e8]'
            }`}
            data-slide
          >
            <div className="w-full max-w-6xl lg:grid lg:grid-cols-2 lg:items-stretch">
              <div
                className={`flex min-h-[250px] items-center justify-center p-10 ${
                  isEvenSection ? 'lg:order-2' : 'lg:order-1'
                }`}
              >
                <div className={`showcase-theme-art showcase-theme-art-${(index % 6) + 1}`} aria-hidden="true">
                  <span className="showcase-art-ring showcase-art-ring-1" />
                  <span className="showcase-art-ring showcase-art-ring-2" />
                  <span className="showcase-art-core">
                    {(() => {
                      const Main = artSets[index % artSets.length].main
                      return <Main strokeWidth={1.6} />
                    })()}
                  </span>
                  {artSets[index % artSets.length].sats.map((Sat, satIndex) => (
                    <span className={`showcase-art-sat showcase-art-sat-${satIndex + 1}`} key={satIndex}>
                      <Sat strokeWidth={1.8} />
                    </span>
                  ))}
                </div>
              </div>

              <div
                className={`flex flex-col justify-center p-8 sm:p-10 lg:p-12 ${
                  isEvenSection
                    ? 'lg:order-1 lg:border-r lg:border-[#ebdcc9]'
                    : 'lg:order-2 lg:border-l lg:border-[#ebdcc9]'
                }`}
              >
                <p className="exp-period mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#d66d28]">{item.period}</p>
                <h2 className="mb-4 font-serif text-3xl font-bold text-[#1f2327] sm:text-4xl">{item.role}</h2>
                <p className="mb-8 max-w-3xl text-base leading-relaxed text-[#50575d] sm:text-lg">{item.company}</p>
                <div className="flex flex-col gap-4">
                  {item.bullets.map((bullet) => (
                    <div key={bullet} className="flex gap-3 text-base leading-relaxed text-[#50575d] sm:text-lg">
                      <span className="exp-bullet mt-2 size-2 shrink-0 rounded-full bg-[#d66d28]" />
                      <span>{renderBulletText(bullet)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )
      })}
    </ObserverSlidePage>
  )
}
