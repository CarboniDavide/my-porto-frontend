import { useTranslation } from 'react-i18next'
import {
  Building2, Landmark, Code2, Database, Rocket, Layers, GitBranch, Server, BookOpen, Globe,
  Newspaper, Boxes, Terminal, Puzzle, Music, Wrench, Palette, UtensilsCrossed, Users, Star, Coffee,
  type LucideIcon,
} from 'lucide-react'
import { ArtCluster } from './ArtCluster'

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
  return bullet.split(/(dclics\.ch|journee-mmt\.ch)/gi).map((part, index) => {
    const lower = part.toLowerCase()
    if (lower === 'dclics.ch' || lower === 'journee-mmt.ch') {
      return (
        <a
          key={index}
          href={`https://${lower}`}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-[var(--tone)] underline decoration-[var(--tone)]/60 underline-offset-2"
        >
          {part}
        </a>
      )
    }
    return <span key={index}>{part}</span>
  })
}

export function ExperienceList() {
  const { t } = useTranslation('translation')
  const items = t('experiences.items', { returnObjects: true }) as ExperienceItem[]
  if (!Array.isArray(items)) return null

  return (
    <div className="topic-list mt-4 flex flex-col gap-8">
      {items.map((item, index) => {
        const tone = (index % 6) + 1
        const art = artSets[index % artSets.length]
        return (
          <div
            key={`${item.company}-${item.period}`}
            className={`topic-item exp-tone-${tone} flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-8`}
          >
            <ArtCluster main={art.main} sats={art.sats} palette={tone} />
            <div className="min-w-0 flex-1">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--tone)]">{item.period}</p>
              <h3 className="mb-1 font-serif text-xl font-bold text-[#1f2327] sm:text-2xl">{item.role}</h3>
              <p className="mb-3 text-sm text-[#50575d] sm:text-base">{item.company}</p>
              <div className="flex flex-col gap-2">
                {item.bullets.map((bullet) => (
                  <div key={bullet} className="flex gap-3 text-sm leading-relaxed text-[#50575d] sm:text-base">
                    <span className="mt-2 size-2 shrink-0 rounded-full bg-[var(--tone)]" />
                    <span>{renderBulletText(bullet)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
