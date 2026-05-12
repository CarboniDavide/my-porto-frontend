const baseUrl = import.meta.env.VITE_CHAT_API_BASE?.replace(/\/$/, '') ?? ''
const wakeupEndpoint = `${baseUrl}/api/wakeup`

export async function wakeupServer(signal?: AbortSignal): Promise<void> {
  const response = await fetch(wakeupEndpoint, {
    method: 'GET',
    signal,
  })

  if (!response.ok) {
    throw new Error('Wakeup request failed')
  }
}
