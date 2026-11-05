import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useChat } from '../hooks/useChat'
import { usePageSeo } from '../hooks/usePageSeo'
import { RecaptchaNotice } from '../components/RecapchaNotice'
import { ChatBubble, TypingIndicator } from '../components/ChatBubble'
import { ChatInput } from '../components/ChatInput'
import { ChatWaveBackground } from '../components/ChatWaveBackground'
import { CHAT_ASK_EVENT } from '../chat/events'

export function ChatPage() {
  usePageSeo('chat')
  const { messages, isLoading, error, send, addAssistantMessage, reset } = useChat('/api/chat')
  const { t } = useTranslation('translation')
  const quickAnswers = t('chat.quickAnswers', { returnObjects: true }) as { id: string; label: string }[]
  const [isMobileInput, setIsMobileInput] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 640px)').matches : false,
  )
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputPlaceholder = isMobileInput ? t('chat.placeholderMobile') : t('chat.placeholder')
  const isChatActive = messages.length > 0
  // Keeps the last messages on screen while the panel slides closed
  const [renderedMessages, setRenderedMessages] = useState(messages)
  if (isChatActive && renderedMessages !== messages) setRenderedMessages(messages)

  useEffect(() => {
    if (isChatActive) return
    const timer = window.setTimeout(() => setRenderedMessages([]), 700)
    return () => window.clearTimeout(timer)
  }, [isChatActive])

  const contentRef = useRef<HTMLDivElement>(null)
  const followUntilRef = useRef(0)

  // Cards (e.g. showcase scenarios) can ask the assistant a question
  const sendRef = useRef(send)
  sendRef.current = send
  useEffect(() => {
    const onAsk = (event: Event) => {
      const text = (event as CustomEvent<string>).detail
      if (text) void sendRef.current(text)
    }
    window.addEventListener(CHAT_ASK_EVENT, onAsk)
    return () => window.removeEventListener(CHAT_ASK_EVENT, onAsk)
  }, [])

  function scrollToLatest(behavior: ScrollBehavior) {
    const anchor = bottomRef.current
    if (!anchor) return
    const last = anchor.previousElementSibling as HTMLElement | null
    // Keep the end of the answer above the sticky input; if it is taller than the free area, show its start instead
    const freeHeight = window.innerHeight - 64 - 260
    const tooTall = !!last && last.offsetHeight > freeHeight
    if (tooTall && last) {
      last.style.scrollMarginTop = '5rem'
      last.scrollIntoView({ behavior, block: 'start' })
    } else {
      anchor.scrollIntoView({ behavior, block: 'end' })
    }
  }

  // New messages start a short "follow" window: the answer keeps growing (catalog fetch, animations, form), so the view is kept on it
  useEffect(() => {
    if (!isChatActive) return
    followUntilRef.current = Date.now() + 2500
    scrollToLatest('smooth')
  }, [messages, isLoading, isChatActive])

  useEffect(() => {
    const content = contentRef.current
    if (!content) return
    const observer = new ResizeObserver(() => {
      if (Date.now() < followUntilRef.current) scrollToLatest('auto')
    })
    observer.observe(content)
    return () => observer.disconnect()
  }, [])

  // Fades the messages out where they reach the dock, so the background stays untouched
  const messagesRef = useRef<HTMLDivElement>(null)
  const dockRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const update = () => {
      const messages = messagesRef.current
      const dock = dockRef.current
      if (!messages || !dock) return
      if (!isChatActive) {
        messages.style.removeProperty('mask-image')
        messages.style.removeProperty('-webkit-mask-image')
        return
      }
      const end = Math.max(0, dock.getBoundingClientRect().top - messages.getBoundingClientRect().top - 6)
      const mask = `linear-gradient(to bottom, #000 ${Math.max(0, end - 56)}px, transparent ${end}px)`
      messages.style.setProperty('mask-image', mask)
      messages.style.setProperty('-webkit-mask-image', mask)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    const observer = new ResizeObserver(update)
    if (messagesRef.current) observer.observe(messagesRef.current)
    if (dockRef.current) observer.observe(dockRef.current)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      observer.disconnect()
    }
  }, [isChatActive])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(max-width: 640px)')
    const updateViewport = (e: MediaQueryListEvent) => {
      setIsMobileInput(e.matches)
    }

    mediaQuery.addEventListener('change', updateViewport)

    return () => {
      mediaQuery.removeEventListener('change', updateViewport)
    }
  }, [])

  return (
    <section className="chat-page relative isolate flex min-h-[calc(100dvh-7.5rem)] flex-col [clip-path:inset(0)] sm:min-h-[calc(100dvh-6rem)]">
      <ChatWaveBackground />

      <div className="chat-stage relative z-10 mx-auto flex min-h-0 w-full flex-1 flex-col items-center" data-open={isChatActive}>
        <div className="chat-collapse chat-intro" aria-hidden={isChatActive}>
          <div>
            <h1 className="chat-title mx-auto mb-4 text-center font-serif text-3xl font-bold sm:text-5xl">
              {t('chat.title') as string}
            </h1>
            <p className="chat-subtitle mx-auto mb-7 max-w-3xl text-center text-sm sm:text-base">
              {t('chat.subtitle') as string}
            </p>
          </div>
        </div>

        <section className="chat-session-shell" data-open={isChatActive}>
          <div className="chat-session-collapse">
            <div ref={messagesRef} className="chat-session-messages flex flex-col p-3 sm:p-5">
              <div ref={contentRef} className="my-auto flex w-full flex-col gap-4">
                {renderedMessages.map((msg) => (
                  <ChatBubble key={msg.id} message={msg} />
                ))}
                {isLoading && <TypingIndicator />}
                <div ref={bottomRef} className="scroll-mb-72" />
              </div>
            </div>
          </div>

          {error && isChatActive && <p className="px-4 pt-2 text-sm text-red-600 sm:px-6">{t('chat.error')}</p>}
          <div ref={dockRef} className="chat-dock" data-open={isChatActive}>
            <ChatInput
              placeholder={inputPlaceholder}
              onSend={send}
              onAssistantMessage={addAssistantMessage}
              onReset={reset}
              showUpload={true}
              showReset={isChatActive}
              uploadEndpoint="/api/chat"
              disabled={isLoading}
              embedded
            />
            <div className="chat-suggestions" aria-label={t('chat.empty')}>
              {quickAnswers.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  className="chat-suggestion-button font-bold"
                  disabled={isLoading}
                  onClick={() => void send(label, id)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
      <RecaptchaNotice className="fixed bottom-2 left-1/2 z-40 w-[min(92vw,820px)] -translate-x-1/2" />
    </section>
  )
}
