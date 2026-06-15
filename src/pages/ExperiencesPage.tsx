import { useTranslation } from 'react-i18next'
import { usePageSeo } from '../hooks/usePageSeo'
import { Briefcase, ChevronDown } from 'lucide-react'
import { ObserverSlidePage } from '../components/ObserverSlidePage'

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
      <section className="relative box-border flex items-center justify-center bg-white px-4 py-16 sm:px-6 sm:py-20 h-auto min-h-[60vh] md:h-[calc(100svh-4rem)]" data-slide>
        <div className="w-full max-w-4xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#d66d28]">{t('nav.experiences')}</p>
          <h1 className="mb-6 font-serif text-4xl font-bold text-[#1f2327] sm:text-6xl">{t('experiences.title')}</h1>
          <p className="mb-8 text-lg leading-relaxed text-[#50575d] sm:text-xl">{t('experiences.text')}</p>
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
            className={`box-border flex items-center justify-center border-t border-[#ebdcc9] px-4 py-16 sm:px-6 sm:py-20 h-auto min-h-[60vh] md:h-[calc(100svh-4rem)] ${
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
                <Briefcase className="size-40 text-[#d66d28] sm:size-80 opacity-90" />
              </div>

              <div
                className={`flex flex-col justify-center p-8 sm:p-10 lg:p-12 ${
                  isEvenSection
                    ? 'lg:order-1 lg:border-r lg:border-[#ebdcc9]'
                    : 'lg:order-2 lg:border-l lg:border-[#ebdcc9]'
                }`}
              >
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#d66d28]">{item.period}</p>
                <h2 className="mb-4 font-serif text-3xl font-bold text-[#1f2327] sm:text-4xl">{item.role}</h2>
                <p className="mb-8 max-w-3xl text-base leading-relaxed text-[#50575d] sm:text-lg">{item.company}</p>
                <div className="flex flex-col gap-4">
                  {item.bullets.map((bullet) => (
                    <div key={bullet} className="flex gap-3 text-base leading-relaxed text-[#50575d] sm:text-lg">
                      <span className="mt-2 size-2 shrink-0 rounded-full bg-[#d66d28]" />
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
