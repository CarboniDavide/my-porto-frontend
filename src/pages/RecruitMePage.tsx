import { useRef, useEffect } from 'react'
import { useChat } from '../hooks/useChat'
import { usePageSeo } from '../hooks/usePageSeo'
import { useTranslation } from 'react-i18next'
import { ChatBubble, TypingIndicator } from '../components/ChatBubble'
import { RecaptchaNotice } from '../components/RecapchaNotice'
import { ChatInput } from '../components/ChatInput'

export function RecruitMePage() {
  usePageSeo('recruit-me')
  const { t } = useTranslation('translation')
  const { messages, isLoading, error, send, addAssistantMessage, reset } = useChat('/api/recruit-chat')
  const bottomRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

useEffect(() => {
  if (messages.length > 0) {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }
}, [messages, isLoading]);

  return (
    <section className="relative isolate flex flex-col h-[calc(100dvh-4rem)] sm:h-[calc(100dvh-4rem)] bg-white">
      
      {messages.length === 0 && (
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center px-4 sm:px-6 mt-8 mb-4">
          <h1 className="text-center font-serif text-2xl sm:text-3xl font-bold text-[#d66d28]">{t('recruitMe.title')}</h1>
          <p className="mt-3 text-center text-[#d66d28] text-base sm:text-lg max-w-xs sm:max-w-2xl">{t('recruitMe.subtitle')}</p>
        </div>
      )}

      <div className={messages.length === 0 ? "relative z-10 flex-1 overflow-hidden flex flex-col" : "relative z-10 flex-1 overflow-hidden flex flex-col mt-0"}>
        <div className={messages.length === 0 ? "mx-auto h-full w-full max-w-5xl overflow-hidden px-2 py-2 sm:px-6 sm:py-8 flex flex-col" : "mx-auto h-full w-full max-w-5xl overflow-hidden px-2 pt-2 sm:px-6 sm:pt-6 flex flex-col"}>
          <section className="flex flex-1 w-full min-w-0 flex-col overflow-hidden rounded-3xl border border-[#ebdcc9] bg-[#fffaf4]">
            <div ref={chatContainerRef} className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain bg-[#fdf4e8] p-2 sm:p-6">
              {messages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={bottomRef} />
              {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
            </div>
          </section>
        </div>
      </div>

      <div className="relative z-20 mx-auto w-full max-w-5xl px-2 py-2 sm:px-6 sm:py-6">
        <ChatInput
          placeholder={t('recruitMe.placeholder')}
          onSend={send}
          onAssistantMessage={addAssistantMessage}
          onReset={reset}
          showUpload={true}
          showReset={true}
          uploadEndpoint="/api/recruit-chat"
          disabled={isLoading}
        />
      </div>
      <RecaptchaNotice className="text-xs leading-relaxed text-[#7d7f80] text-center mb-2"/>
    </section>
  )
}
