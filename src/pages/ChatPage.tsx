import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useChat } from '../hooks/useChat'
import { usePageSeo } from '../hooks/usePageSeo'
import { RecaptchaNotice } from '../components/RecapchaNotice'
import { ChatBubble, TypingIndicator } from '../components/ChatBubble'
import { ChatInput } from '../components/ChatInput'
import { FunnyPlay } from '../components/FunnyPlay'

export function ChatPage() {
  usePageSeo('chat')
  const { messages, isLoading, error, send, reset } = useChat('/api/chat')
  const { t } = useTranslation('translation')
  const [searchParams] = useSearchParams()
  const themeStarters = t('chat.themeStarters', { returnObjects: true }) as Record<string, string>
  const topic = searchParams.get('topic') ?? ''
  const themedStarter = themeStarters[topic]
  const [isMobileInput, setIsMobileInput] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 640px)').matches : false,
  )
  const bottomRef = useRef<HTMLDivElement>(null)
  const autoStartedTopicRef = useRef<string | null>(null)
  const inputPlaceholder = isMobileInput ? t('chat.placeholderMobile') : t('chat.placeholder')

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

    setIsMobileInput(mediaQuery.matches)
    mediaQuery.addEventListener('change', updateViewport)

    return () => {
      mediaQuery.removeEventListener('change', updateViewport)
    }
  }, [])

  return (
    <section className="relative isolate flex h-[calc(100dvh-7.5rem)] flex-col sm:h-[calc(100dvh-6rem)]">
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/bg_chat.jpg)' }}
        aria-hidden="true"
      />

      {messages.length === 0 ? (
        <FunnyPlay
          t={t}
          inputPlaceholder={inputPlaceholder}
          onSend={send}
          onReset={reset}
          isLoading={isLoading}
        />
      ) : (
        <>
          <div className="relative z-10 flex-1 overflow-hidden">
            <div className="mx-auto h-full w-full max-w-6xl overflow-hidden px-2 py-2 sm:px-6 sm:py-8">
              <section className="flex h-full w-full min-w-0 flex-col overflow-hidden rounded-3xl border border-[#ebdcc9] bg-[#fffaf4] shadow-2xl">
                <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain bg-[#fdf4e8] p-2 sm:p-6">
                  {messages.map((msg) => (
                    <ChatBubble key={msg.id} message={msg} />
                  ))}
                  {isLoading && <TypingIndicator />}
                  <div ref={bottomRef} />
                </div>

                {error && <p className="px-4 pb-2 text-sm text-red-600 sm:px-6">{t('chat.error')}</p>}
              </section>
            </div>
          </div>

          <div className="relative z-20 mx-auto w-full max-w-6xl px-2 py-2 sm:px-6 sm:py-6">
            <ChatInput
              placeholder={inputPlaceholder}
              onSend={send}
              onReset={reset}
              showUpload={false}
              showReset={true}
              disabled={isLoading}
            />
          </div>
        </>
      )}

      <RecaptchaNotice className="fixed bottom-2 left-1/2 z-40 w-[min(92vw,820px)] -translate-x-1/2" />
    </section>
  )
}
