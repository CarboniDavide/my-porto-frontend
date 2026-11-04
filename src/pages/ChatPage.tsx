import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useChat } from '../hooks/useChat'
import { usePageSeo } from '../hooks/usePageSeo'
import { RecaptchaNotice } from '../components/RecapchaNotice'
import { ChatBubble, TypingIndicator } from '../components/ChatBubble'
import { ChatInput } from '../components/ChatInput'

export function ChatPage() {
  usePageSeo('chat')
  const { messages, isLoading, error, send, addAssistantMessage, reset } = useChat('/api/chat')
  const { t } = useTranslation('translation')
  const [searchParams] = useSearchParams()
  const neuralCanvasRef = useRef<HTMLCanvasElement>(null)
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
    const canvas = neuralCanvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let width = 0
    let height = 0
    let frameId = 0


    function resizeCanvas() {
      const bounds = canvas.getBoundingClientRect()
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      width = bounds.width
      height = bounds.height
      canvas.width = Math.round(width * pixelRatio)
      canvas.height = Math.round(height * pixelRatio)
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)

    }

    function draw(time: number) {
      context.clearRect(0, 0, width, height)
      const top = height * 0.5
      const lineCount = 22
      const spacing = (height - top) / (lineCount - 1)
      const t = time * 0.00004
      const step = 8
      const gradient = context.createLinearGradient(0, 0, width, 0)
      gradient.addColorStop(0, '#6558e8')
      gradient.addColorStop(0.35, '#3b82f6')
      gradient.addColorStop(0.65, '#06b6d4')
      gradient.addColorStop(1, '#ec4899')
      context.strokeStyle = gradient

      for (let line = 0; line < lineCount; line += 1) {
        const baseY = top + line * spacing
        const depth = line / lineCount
        context.beginPath()
        for (let x = 0; x <= width + step; x += step) {
          const nx = x / width
          const amplitude = 0.35 + 1.25 * Math.sin(nx * 2.4 + t * 0.9 + line * 0.04) ** 2
          const swell = Math.sin(nx * 3.2 + t * 1.3 + line * 0.11) * (18 + 40 * depth) * amplitude
          const ripple = Math.sin(nx * 7.5 - t * 1.9 + line * 0.2) * 12 * amplitude
          const drift = Math.sin(nx * 1.4 - t * 0.8 + line * 0.05) * 26
          // Lines sag toward the center and flatten out toward the bottom
          const sag = Math.sin(nx * Math.PI) * height * 0.09 * (1 - depth)
          const y = baseY + swell + ripple + drift + sag
          if (x === 0) context.moveTo(x, y)
          else context.lineTo(x, y)
        }
        const alpha = (0.05 + 0.2 * depth) * (0.7 + 0.3 * Math.sin(line * 0.35 + t * 1.2) ** 2)
        context.globalAlpha = Math.min(1, alpha * 1.6)
        context.lineWidth = 1.2
        context.stroke()
      }
      context.globalAlpha = 1

      if (!motionPreference.matches) frameId = window.requestAnimationFrame(draw)
    }
    function handleMotionPreferenceChange() {
      window.cancelAnimationFrame(frameId)
      draw(0)
    }

    function handleResize() {
      resizeCanvas()
      if (motionPreference.matches) draw(0)
    }

    resizeCanvas()
    draw(0)
    window.addEventListener('resize', handleResize)
    motionPreference.addEventListener('change', handleMotionPreferenceChange)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('resize', handleResize)
      motionPreference.removeEventListener('change', handleMotionPreferenceChange)
    }
  }, [])

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
      <div className="chat-background absolute inset-0 z-0" aria-hidden="true">
        <span className="chat-background-orb chat-background-orb-one" />
        <span className="chat-background-orb chat-background-orb-two" />
        <canvas ref={neuralCanvasRef} className="chat-neural-canvas" aria-hidden="true" />
      </div>

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
