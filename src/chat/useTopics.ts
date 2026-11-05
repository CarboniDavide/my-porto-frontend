import { useEffect, useState } from 'react'

export type TopicLink = { label: string; url: string; icon: string }

export type Topic = {
  id: string
  description: string
  icon: string
  satellites: [string, string, string]
  palette: number
  links?: TopicLink[]
}

const baseUrl = import.meta.env.VITE_CHAT_API_BASE?.replace(/\/$/, '') ?? ''
let cache: Promise<Topic[]> | null = null

function loadTopics(force = false): Promise<Topic[]> {
  if (force) cache = null
  cache ??= fetch(`${baseUrl}/api/topics`)
    .then((res) => (res.ok ? res.json() : Promise.reject(new Error('topics unavailable'))))
    .then((data: { topics: Topic[] }) => data.topics)
    .catch(() => {
      cache = null
      return []
    })
  return cache
}

// When requiredId is missing from the cached catalog (e.g. the backend was updated), it is fetched again once
export function useTopics(requiredId?: string) {
  const [topics, setTopics] = useState<Topic[]>([])
  useEffect(() => {
    let active = true
    void loadTopics().then(async (list) => {
      const missing = requiredId && !list.some((topic) => topic.id === requiredId)
      const next = missing ? await loadTopics(true) : list
      if (active) setTopics(next)
    })
    return () => {
      active = false
    }
  }, [requiredId])
  return topics
}
