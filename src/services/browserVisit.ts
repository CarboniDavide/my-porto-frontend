const VISIT_SESSION_KEY = 'portfolio_browser_visit_registered'
const baseUrl = import.meta.env.VITE_CHAT_API_BASE?.replace(/\/$/, '') ?? ''
const HOME_ROUTES = new Set(['/', '/en', '/it', '/fr'])

export async function registerBrowserVisit(): Promise<void> {
  if (typeof window === 'undefined') {
    return
  }

  if (!HOME_ROUTES.has(window.location.pathname)) {
    return
  }

  if (sessionStorage.getItem(VISIT_SESSION_KEY) === '1') {
    return
  }

  const endpoint = `${baseUrl}/api/visit`

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })

    if (response.ok || response.status === 202 || response.status === 204) {
      sessionStorage.setItem(VISIT_SESSION_KEY, '1')
    }
  } catch {
    // Ignore network errors; backend is the source of truth.
  }
}
