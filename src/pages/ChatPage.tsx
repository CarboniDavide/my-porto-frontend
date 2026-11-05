import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useChat } from '../hooks/useChat'
import { usePageSeo } from '../hooks/usePageSeo'
import { RecaptchaNotice } from '../components/RecapchaNotice'
import { ChatBubble, TypingIndicator } from '../components/ChatBubble'
import { ChatInput } from '../components/ChatInput'
import { ChatWaveBackground } from '../components/ChatWaveBackground'

export function ChatPage() {
  usePageSeo('chat')
  const { messages, isLoading, error, send, addAssistantMessage, reset } = useChat('/api/chat')
  const { t } = useTranslation('translation')
  const [searchParams] = useSearchParams()
  const suggestions = t('chat.suggestions', { returnObjects: true }) as string[]
  const themeStarters = t('chat.themeStarters', { returnObjects: true }) as Record<string, string>
  const topic = searchParams.get('topic') ?? ''
  const themedStarter = themeStarters[topic]
  const [isMobileInput, setIsMobileInput] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 640px)').matches : false,
  )
  const bottomRef = useRef<HTMLDivElement>(null)
  const autoStartedTopicRef = useRef<string | null>(null)
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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    if (!topic || !themedStarter || isLoading) return
    if (autoStartedTopicRef.current === topic) return

    reset()
    autoStartedTopicRef.current = topic
    void send(themedStarter)
  }, [topic, themedStarter, isLoading, reset, send])

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
    <section className="chat-page relative isolate flex h-[calc(100dvh-7.5rem)] flex-col sm:h-[calc(100dvh-6rem)]">
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
            <div className="chat-session-messages flex flex-col gap-4 overflow-y-auto overscroll-contain p-3 sm:p-6">
              {renderedMessages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={bottomRef} />
            </div>
          </div>

          {error && isChatActive && <p className="px-4 pt-2 text-sm text-red-600 sm:px-6">{t('chat.error')}</p>}
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
        </section>

        <div className="chat-collapse chat-suggestions-wrap" aria-hidden={isChatActive}>
          <div>
            <div className="chat-suggestions" aria-label={t('chat.empty')}>
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  className="chat-suggestion-button"
                  disabled={isLoading || isChatActive}
                  tabIndex={isChatActive ? -1 : 0}
                  onClick={() => void send(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <RecaptchaNotice className="fixed bottom-2 left-1/2 z-40 w-[min(92vw,820px)] -translate-x-1/2" />
    </section>
  )
}
