import type { LucideIcon } from 'lucide-react'

type Props = { main: LucideIcon; sats: LucideIcon[]; palette: number; className?: string }

// Same icon cluster as the topic hero, sized for list rows
export function ArtCluster({ main: Main, sats, palette, className = '' }: Props) {
  return (
    <div className={`showcase-theme-art showcase-theme-art-${palette} !w-[clamp(96px,26vw,132px)] shrink-0 ${className}`} aria-hidden="true">
      <span className="showcase-art-ring showcase-art-ring-1" />
      <span className="showcase-art-ring showcase-art-ring-2" />
      <span className="showcase-art-core">
        <Main strokeWidth={1.6} />
      </span>
      {sats.map((Sat, i) => (
        <span className={`showcase-art-sat showcase-art-sat-${i + 1}`} key={i}>
          <Sat strokeWidth={1.8} />
        </span>
      ))}
    </div>
  )
}
