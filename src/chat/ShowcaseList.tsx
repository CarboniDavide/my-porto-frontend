import { useTranslation } from 'react-i18next'
import {
  BrainCircuit, FileSearch, Sparkles, Bot, Zap, MessageSquare, Layers, Database, Code2, Rocket, Gauge, ShieldCheck,
  type LucideIcon,
} from 'lucide-react'
import { ArtCluster } from './ArtCluster'
import { CHAT_ASK_EVENT } from './events'

const artSets: { main: LucideIcon; sats: LucideIcon[] }[] = [
  { main: BrainCircuit, sats: [Bot, Zap, MessageSquare] },
  { main: FileSearch, sats: [Layers, Database, Code2] },
  { main: Sparkles, sats: [Rocket, Gauge, ShieldCheck] },
]

type ProjectItem = { title: string; description: string; stack: string[]; link: string }

export function ShowcaseList() {
  const { t } = useTranslation('translation')
  const items = t('projects.items', { returnObjects: true }) as ProjectItem[]
  if (!Array.isArray(items)) return null

  return (
    <div className="topic-list mt-4 flex flex-col gap-8">
      {items.slice(0, 3).map((item, index) => {
        const tone = (index % 6) + 1
        const art = artSets[index % artSets.length]
        return (
          <div
            key={item.link}
            className={`topic-item exp-tone-${tone} flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-8`}
          >
            <ArtCluster main={art.main} sats={art.sats} palette={tone} />
            <div className="min-w-0 flex-1">
              <h3 className="mb-2 font-serif text-xl font-bold text-[#1f2327] sm:text-2xl">{item.title}</h3>
              <p className="mb-4 text-sm leading-relaxed text-[#50575d] sm:text-base">{item.description}</p>
              <div className="mb-4 flex flex-wrap gap-2">
                {item.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-[var(--tone)]/25 bg-white/70 px-3 py-1.5 text-xs font-semibold text-[var(--tone)] sm:text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent(CHAT_ASK_EVENT, { detail: item.title }))}
                className="inline-flex rounded-full bg-[var(--tone)] px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:brightness-95"
              >
                {t('projects.cta')}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
