import { useEffect } from 'react'
import { wakeupServer } from '../services/wakeupApi'

const WAKEUP_SESSION_KEY = 'wakeup-called'

/**
 * Pings the backend wakeup endpoint once per browser session.
 * Does nothing if VITE_CHAT_API_BASE is not defined.
 */
export function useWakeup(): void {
  useEffect(() => {
    if (import.meta.env.VITE_WAKEUP_ACTIVE !== 'true') return

    const baseUrl = import.meta.env.VITE_CHAT_API_BASE as string | undefined
    if (!baseUrl) return

    if (sessionStorage.getItem(WAKEUP_SESSION_KEY) === '1') return

    sessionStorage.setItem(WAKEUP_SESSION_KEY, '1')

    wakeupServer().catch(() => {
      sessionStorage.removeItem(WAKEUP_SESSION_KEY)
    })
  }, [])
}
