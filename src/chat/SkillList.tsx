import { useTranslation } from 'react-i18next'
import {
  Server, Database, Container, Layout, Terminal, GitBranch, Workflow, Network, Palette,
  MonitorSmartphone, MousePointerClick, ClipboardList, CalendarCheck, Target, Users, ShieldCheck,
  type LucideIcon,
} from 'lucide-react'
import { ArtCluster } from './ArtCluster'

// Same order as skills.categories: backend, frontend, quality/DevOps, project management
const categoryArt: { main: LucideIcon; sats: LucideIcon[] }[] = [
  { main: Server, sats: [Database, Network, Terminal] },
  { main: Layout, sats: [Palette, MonitorSmartphone, MousePointerClick] },
  { main: Container, sats: [GitBranch, Workflow, ShieldCheck] },
  { main: ClipboardList, sats: [CalendarCheck, Target, Users] },
]

type SkillCategory = { name: string; text?: string; items: string[] }

export function SkillList() {
  const { t } = useTranslation('translation')
  const categories = t('skills.categories', { returnObjects: true }) as SkillCategory[]
  if (!Array.isArray(categories)) return null

  return (
    <div className="topic-list mt-4 flex flex-col gap-8">
      {categories.map((category, index) => {
        const tone = (index % 6) + 1
        const art = categoryArt[index % categoryArt.length]
        return (
          <div
            key={category.name}
            className={`topic-item exp-tone-${tone} flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-8`}
          >
            <ArtCluster main={art.main} sats={art.sats} palette={tone} />
            <div className="min-w-0 flex-1">
              <h3 className="mb-2 font-serif text-xl font-bold text-[#1f2327] sm:text-2xl">{category.name}</h3>
              {category.text && <p className="mb-4 text-sm leading-relaxed text-[#50575d] sm:text-base">{category.text}</p>}
              <div className="flex flex-wrap gap-2">
                {category.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[var(--tone)]/25 bg-white/70 px-3 py-1.5 text-xs font-bold uppercase tracking-tight text-[var(--tone)] sm:text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
