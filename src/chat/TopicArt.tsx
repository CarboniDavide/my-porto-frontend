import { resolveIcon } from './icons'
import type { Topic } from './useTopics'

export function TopicArt({ topic, className = '' }: { topic: Topic; className?: string }) {
  const Main = resolveIcon(topic.icon)
  return (
    <div
      className={`showcase-theme-art showcase-theme-art-${topic.palette} !w-[clamp(120px,40vw,200px)] ${className}`}
      aria-hidden="true"
    >
      <span className="showcase-art-ring showcase-art-ring-1" />
      <span className="showcase-art-ring showcase-art-ring-2" />
      <span className="showcase-art-core">
        <Main strokeWidth={1.6} />
      </span>
      {topic.satellites.map((key, i) => {
        const Sat = resolveIcon(key)
        return (
          <span className={`showcase-art-sat showcase-art-sat-${i + 1}`} key={i}>
            <Sat strokeWidth={1.8} />
          </span>
        )
      })}
    </div>
  )
}
