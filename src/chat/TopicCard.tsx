import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { TopicArt } from './TopicArt'
import { ContactForm } from './ContactForm'
import { ExperienceList } from './ExperienceList'
import { SkillList } from './SkillList'
import { ShowcaseList } from './ShowcaseList'
import { resolveIcon } from './icons'
import type { Topic } from './useTopics'
import type { Message } from '../types/chat'

export function TopicCard({ message, topic }: { message: Message; topic: Topic }) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from(root.current, { opacity: 0, y: 32, scale: 0.97, duration: 0.6 })
        .from('.topic-hero-art .showcase-art-ring', { scale: 0.3, opacity: 0, duration: 0.7, stagger: 0.12 }, '-=0.35')
        .from('.topic-hero-art .showcase-art-core', { scale: 0, rotate: -90, duration: 0.7, ease: 'back.out(1.8)' }, '<0.1')
        .from('.topic-hero-art .showcase-art-sat', { scale: 0, opacity: 0, duration: 0.5, stagger: 0.12, ease: 'back.out(2.4)' }, '-=0.3')
        .from('.topic-title', { opacity: 0, x: -24, duration: 0.5 }, '-=0.7')
        .from('.topic-paragraph', { opacity: 0, y: 16, duration: 0.5, stagger: 0.12 }, '-=0.3')
        .from('.topic-form', { opacity: 0, y: 16, duration: 0.5 }, '-=0.2')
        .from('.topic-item', { opacity: 0, y: 28, duration: 0.55, stagger: 0.18 }, '-=0.2')
    },
    { scope: root },
  )

  return (
    <article ref={root} className="topic-card flex flex-col gap-4 p-5 text-[#1f2327] sm:p-8">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
        <TopicArt topic={topic} className="topic-hero-art" />
        <div className="min-w-0 flex-1">
          {message.title && <h2 className="topic-title mb-3 font-serif text-2xl font-bold sm:text-3xl">{message.title}</h2>}
          <div className="flex flex-col gap-3 text-sm leading-relaxed text-[#50575d] sm:text-base">
            {message.content.split(/\n{2,}/).map((paragraph, i) => (
              <p key={i} className="topic-paragraph whitespace-pre-wrap">{paragraph}</p>
            ))}
          </div>
          {topic.id === 'contact' && <ContactForm />}
          {topic.links && topic.links.length > 0 && (
            <div className="topic-form mt-6 flex flex-wrap gap-3">
              {topic.links.map(({ label, url, icon }) => {
                const Icon = resolveIcon(icon)
                return (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    title={label}
                    className="flex size-14 items-center justify-center rounded-full border border-[#ebdcc9] bg-[#fdf4e8] text-[#1f2327] transition hover:-translate-y-0.5 hover:border-[#d66d28] hover:text-[#d66d28]"
                  >
                    <Icon className="size-7" />
                  </a>
                )
              })}
            </div>
          )}
        </div>
      </div>
      {topic.id === 'experiences' && <ExperienceList />}
      {topic.id === 'skills' && <SkillList />}
      {topic.id === 'showcase' && <ShowcaseList />}
    </article>
  )
}
