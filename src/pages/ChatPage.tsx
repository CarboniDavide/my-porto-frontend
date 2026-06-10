import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Brain, Gamepad2, MessageCircle, Music2, RotateCcw, Trophy } from 'lucide-react'
import { useChat } from '../hooks/useChat'
import { usePageSeo } from '../hooks/usePageSeo'
import { RecaptchaNotice } from '../components/RecapchaNotice'
import { ChatBubble, TypingIndicator } from '../components/ChatBubble'
import { ChatInput } from '../components/ChatInput'

type ActivityMode = 'chat' | 'piano' | 'game' | 'quiz'
type QuizQuestion = { q: string; options: string[]; answer: number; note: string }

const FALLBACK_QUIZ: QuizQuestion[] = [
  {
    q: 'Which number completes the pattern: 2, 6, 12, 20, ?'
    , options: ['28', '30', '32', '36'],
    answer: 1,
    note: 'Pattern is n(n+1): 1x2, 2x3, 3x4, 4x5, 5x6 = 30.',
  },
  {
    q: 'If all Bloops are Razzies and all Razzies are Lazzies, then all Bloops are...'
    , options: ['Not Lazzies', 'Lazzies', 'Only sometimes Lazzies', 'None of the above'],
    answer: 1,
    note: 'Classic transitive syllogism.',
  },
  {
    q: 'A bat and a ball cost 1.10 total. Bat costs 1.00 more than ball. Ball costs...'
    , options: ['0.05', '0.10', '0.15', '0.20'],
    answer: 0,
    note: 'If ball = x, bat = x + 1.00, total 1.10, so x = 0.05.',
  },
  {
    q: 'Find the odd one out: Triangle, Square, Pentagon, Circle'
    , options: ['Triangle', 'Square', 'Pentagon', 'Circle'],
    answer: 3,
    note: 'Circle has no edges/vertices unlike polygons.',
  },
  {
    q: 'What comes next: AZ, BY, CX, DW, ?'
    , options: ['EV', 'FU', 'GV', 'EZ'],
    answer: 0,
    note: 'First letter increments, second letter decrements.',
  },
]

export function ChatPage() {
  usePageSeo('chat')
  const { messages, isLoading, error, send, reset } = useChat('/api/chat')
  const { t } = useTranslation('translation')
  const [searchParams] = useSearchParams()
  const themeStarters = t('chat.themeStarters', { returnObjects: true }) as Record<string, string>
  const topic = searchParams.get('topic') ?? ''
  const themedStarter = themeStarters[topic]
  const [isMobileInput, setIsMobileInput] = useState(() => typeof window !== 'undefined' ? window.matchMedia('(max-width: 640px)').matches : false)
  const [mode, setMode] = useState<ActivityMode>('chat')
  const bottomRef = useRef<HTMLDivElement>(null)
  const autoStartedTopicRef = useRef<string | null>(null)
  const inputPlaceholder = isMobileInput ? t('chat.placeholderMobile') : t('chat.placeholder')
  const quizQuestions = (t('chat.fun.quiz.questions', { returnObjects: true }) as QuizQuestion[]) || FALLBACK_QUIZ

  const modes: Array<{ id: ActivityMode; label: string; icon: typeof MessageCircle }> = [
    { id: 'chat', label: t('chat.fun.modes.chat'), icon: MessageCircle },
    { id: 'piano', label: t('chat.fun.modes.piano'), icon: Music2 },
    { id: 'game', label: t('chat.fun.modes.game'), icon: Gamepad2 },
    { id: 'quiz', label: t('chat.fun.modes.quiz'), icon: Brain },
  ]

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
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-2 sm:px-6">
          <div className="w-full max-w-5xl px-3 py-6 sm:px-6 sm:py-5">
            <h1 className="mb-6 text-center font-serif text-xl font-bold text-white sm:text-3xl">
              {t('chat.title')}
            </h1>
            <p className="mx-auto mb-6 max-w-3xl text-center text-sm text-[#fffaf4] sm:text-base">
              {t('chat.fun.subtitle')}
            </p>

            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {modes.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setMode(id)}
                  className={[
                    'flex items-center justify-center gap-2 rounded-2xl border px-3 py-3 text-sm font-semibold transition',
                    mode === id
                      ? 'border-[#d66d28] bg-[#d66d28] text-white'
                      : 'border-[#ebdcc9] bg-[#fffaf4] text-[#1f2327] hover:-translate-y-0.5',
                  ].join(' ')}
                >
                  <Icon className="size-4" />
                  {label}
                </button>
              ))}
            </div>

            <div className="rounded-3xl border border-[#ebdcc9] bg-[#fffaf4] p-3 shadow-2xl sm:p-5">
              {mode === 'chat' && (
                <ChatInput
                  placeholder={inputPlaceholder}
                  onSend={send}
                  onReset={reset}
                  showUpload={false}
                  showReset={false}
                  disabled={isLoading}
                />
              )}

              {mode === 'piano' && <PianoPlayground t={t} />}

              {mode === 'game' && <MiniRunner t={t} />}

              {mode === 'quiz' && <LogicQuiz t={t} questions={quizQuestions.length > 0 ? quizQuestions : FALLBACK_QUIZ} />}
            </div>

          </div>
        </div>
      ) : (
        <>
          <div className="relative z-10 flex-1 overflow-hidden">
            <div className="mx-auto h-full w-full max-w-6xl overflow-hidden px-2 py-2 sm:px-6 sm:py-8">
              <section className="flex h-full w-full min-w-0 flex-col overflow-hidden rounded-3xl border border-[#ebdcc9] bg-[#fffaf4] shadow-2xl">
                <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain bg-[#fdf4e8] p-2 sm:p-6">
                  {messages.map((msg) => <ChatBubble key={msg.id} message={msg} />)}
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

      <RecaptchaNotice className='fixed bottom-2 left-1/2 z-40 w-[min(92vw,820px)] -translate-x-1/2'/>
    </section>
  )
}

function PianoPlayground({ t }: { t: (key: string) => string }) {
  const audioContextRef = useRef<AudioContext | null>(null)
  const activeNodesRef = useRef<Map<string, { oscillators: OscillatorNode[]; gain: GainNode }>>(new Map())
  const [activeKeys, setActiveKeys] = useState<string[]>([])

  const keys = [
    { id: 'C4', key: 'a', freq: 261.63, type: 'white', left: 0 },
    { id: 'C#4', key: 'w', freq: 277.18, type: 'black', left: 7.5 },
    { id: 'D4', key: 's', freq: 293.66, type: 'white', left: 12.5 },
    { id: 'D#4', key: 'e', freq: 311.13, type: 'black', left: 20 },
    { id: 'E4', key: 'd', freq: 329.63, type: 'white', left: 25 },
    { id: 'F4', key: 'f', freq: 349.23, type: 'white', left: 37.5 },
    { id: 'F#4', key: 't', freq: 369.99, type: 'black', left: 45 },
    { id: 'G4', key: 'g', freq: 392.0, type: 'white', left: 50 },
    { id: 'G#4', key: 'y', freq: 415.3, type: 'black', left: 57.5 },
    { id: 'A4', key: 'h', freq: 440.0, type: 'white', left: 62.5 },
    { id: 'A#4', key: 'u', freq: 466.16, type: 'black', left: 70 },
    { id: 'B4', key: 'j', freq: 493.88, type: 'white', left: 75 },
    { id: 'C5', key: 'k', freq: 523.25, type: 'white', left: 87.5 },
  ] as const

  function getAudioContext() {
    if (!audioContextRef.current) audioContextRef.current = new AudioContext()
    return audioContextRef.current
  }

  function playNote(noteId: string, freq: number) {
    if (activeNodesRef.current.has(noteId)) return
    const context = getAudioContext()
    const now = context.currentTime
    const gain = context.createGain()

    // Piano-like envelope: fast attack, quick decay, long soft tail.
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.linearRampToValueAtTime(0.48, now + 0.008)
    gain.gain.exponentialRampToValueAtTime(0.2, now + 0.08)
    gain.gain.exponentialRampToValueAtTime(0.0008, now + 1.4)

    const partials = [
      { multiple: 1, level: 1 },
      { multiple: 2, level: 0.35 },
      { multiple: 3, level: 0.12 },
    ]

    const oscillators = partials.map(({ multiple, level }) => {
      const osc = context.createOscillator()
      const partialGain = context.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq * multiple
      partialGain.gain.value = level
      osc.connect(partialGain)
      partialGain.connect(gain)
      osc.start(now)
      return osc
    })

    gain.connect(context.destination)

    activeNodesRef.current.set(noteId, { oscillators, gain })
    setActiveKeys((prev) => (prev.includes(noteId) ? prev : [...prev, noteId]))
  }

  function stopNote(noteId: string) {
    const current = activeNodesRef.current.get(noteId)
    if (!current) return
    const context = getAudioContext()
    current.gain.gain.cancelScheduledValues(context.currentTime)
    current.gain.gain.setValueAtTime(Math.max(current.gain.gain.value, 0.0001), context.currentTime)
    current.gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.09)
    current.oscillators.forEach((osc) => {
      osc.stop(context.currentTime + 0.1)
    })
    activeNodesRef.current.delete(noteId)
    setActiveKeys((prev) => prev.filter((id) => id !== noteId))
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.repeat) return
      const note = keys.find((n) => n.key === event.key.toLowerCase())
      if (!note) return
      void getAudioContext().resume()
      playNote(note.id, note.freq)
    }

    function onKeyUp(event: KeyboardEvent) {
      const note = keys.find((n) => n.key === event.key.toLowerCase())
      if (!note) return
      stopNote(note.id)
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      activeNodesRef.current.forEach((_, key) => stopNote(key))
    }
  }, [])

  return (
    <div>
      <p className="mb-4 text-sm text-[#50575d]">{t('chat.fun.piano.instructions')}</p>
      <div className="relative mx-auto h-48 w-full max-w-3xl overflow-hidden rounded-2xl border border-[#ebdcc9] bg-[#fdf4e8]">
        {keys.filter((k) => k.type === 'white').map((note) => (
          <button
            key={note.id}
            type="button"
            onMouseDown={() => {
              void getAudioContext().resume()
              playNote(note.id, note.freq)
            }}
            onMouseUp={() => stopNote(note.id)}
            onMouseLeave={() => stopNote(note.id)}
            onTouchStart={() => {
              void getAudioContext().resume()
              playNote(note.id, note.freq)
            }}
            onTouchEnd={() => stopNote(note.id)}
            className={[
              'absolute bottom-0 h-full border-r border-[#ebdcc9] bg-white text-xs font-bold uppercase text-[#50575d] transition',
              activeKeys.includes(note.id) ? 'bg-[#ffd9b8]' : 'hover:bg-[#fff4e8]',
            ].join(' ')}
            style={{ left: `${note.left}%`, width: '12.5%' }}
          >
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2">{note.key}</span>
          </button>
        ))}

        {keys.filter((k) => k.type === 'black').map((note) => (
          <button
            key={note.id}
            type="button"
            onMouseDown={() => {
              void getAudioContext().resume()
              playNote(note.id, note.freq)
            }}
            onMouseUp={() => stopNote(note.id)}
            onMouseLeave={() => stopNote(note.id)}
            onTouchStart={() => {
              void getAudioContext().resume()
              playNote(note.id, note.freq)
            }}
            onTouchEnd={() => stopNote(note.id)}
            className={[
              'absolute top-0 z-10 h-[62%] w-[8%] rounded-b-lg bg-[#1f2327] text-[10px] font-bold uppercase text-white transition',
              activeKeys.includes(note.id) ? 'bg-[#d66d28]' : 'hover:bg-[#2e343a]',
            ].join(' ')}
            style={{ left: `${note.left}%` }}
          >
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2">{note.key}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function MiniRunner({ t }: { t: (key: string) => string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const inputRef = useRef({ left: false, right: false })
  const gameRef = useRef({
    playerX: 130,
    playerY: 360,
    playerW: 44,
    playerH: 28,
    obstacleX: 120,
    obstacleY: -20,
    obstacleSize: 22,
    speed: 3,
    score: 0,
  })

  const [isRunning, setIsRunning] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)
  const [score, setScore] = useState(0)

  function resetGame() {
    gameRef.current = {
      playerX: 130,
      playerY: 360,
      playerW: 44,
      playerH: 28,
      obstacleX: Math.random() * 260,
      obstacleY: -20,
      obstacleSize: 22,
      speed: 3,
      score: 0,
    }
    setScore(0)
    setIsGameOver(false)
  }

  function tick() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const g = gameRef.current
    if (inputRef.current.left) g.playerX -= 5
    if (inputRef.current.right) g.playerX += 5
    g.playerX = Math.max(0, Math.min(canvas.width - g.playerW, g.playerX))

    g.obstacleY += g.speed
    if (g.obstacleY > canvas.height + 25) {
      g.obstacleY = -20
      g.obstacleX = Math.random() * (canvas.width - g.obstacleSize)
      g.speed = Math.min(g.speed + 0.08, 8)
      g.score += 1
      setScore(g.score)
    }

    const hit =
      g.obstacleX < g.playerX + g.playerW &&
      g.obstacleX + g.obstacleSize > g.playerX &&
      g.obstacleY < g.playerY + g.playerH &&
      g.obstacleY + g.obstacleSize > g.playerY

    if (hit) {
      setIsGameOver(true)
      setIsRunning(false)
      return
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#fdf4e8'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = '#d66d28'
    ctx.fillRect(g.playerX, g.playerY, g.playerW, g.playerH)

    ctx.fillStyle = '#1f2327'
    ctx.beginPath()
    ctx.arc(g.obstacleX + g.obstacleSize / 2, g.obstacleY + g.obstacleSize / 2, g.obstacleSize / 2, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#1f2327'
    ctx.font = 'bold 14px sans-serif'
    ctx.fillText(`${t('chat.fun.game.score')}: ${g.score}`, 10, 22)

    animationRef.current = requestAnimationFrame(tick)
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') inputRef.current.left = true
      if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') inputRef.current.right = true
    }

    function onKeyUp(event: KeyboardEvent) {
      if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') inputRef.current.left = false
      if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') inputRef.current.right = false
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  useEffect(() => {
    if (!isRunning) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      return
    }

    animationRef.current = requestAnimationFrame(tick)
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [isRunning])

  return (
    <div>
      <p className="mb-3 text-sm text-[#50575d]">{t('chat.fun.game.instructions')}</p>
      <canvas ref={canvasRef} width={320} height={420} className="mx-auto block max-w-full rounded-2xl border border-[#ebdcc9]" />

      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => {
            if (isGameOver) resetGame()
            setIsRunning((prev) => !prev)
          }}
          className="rounded-full bg-[#d66d28] px-5 py-2 text-sm font-semibold text-white hover:bg-[#c05e20]"
        >
          {isRunning ? t('chat.fun.game.pause') : t('chat.fun.game.play')}
        </button>
        <button
          type="button"
          onClick={() => {
            resetGame()
            setIsRunning(false)
          }}
          className="rounded-full border border-[#ebdcc9] bg-white px-5 py-2 text-sm font-semibold text-[#1f2327]"
        >
          {t('chat.fun.game.reset')}
        </button>
      </div>

      <div className="mt-3 flex justify-center gap-3 sm:hidden">
        <button
          type="button"
          onTouchStart={() => {
            inputRef.current.left = true
          }}
          onTouchEnd={() => {
            inputRef.current.left = false
          }}
          className="rounded-xl border border-[#ebdcc9] bg-white px-6 py-3 text-sm font-bold text-[#1f2327]"
        >
          ◀
        </button>
        <button
          type="button"
          onTouchStart={() => {
            inputRef.current.right = true
          }}
          onTouchEnd={() => {
            inputRef.current.right = false
          }}
          className="rounded-xl border border-[#ebdcc9] bg-white px-6 py-3 text-sm font-bold text-[#1f2327]"
        >
          ▶
        </button>
      </div>

      {isGameOver && (
        <p className="mt-4 text-center text-sm font-semibold text-[#1f2327]">
          {t('chat.fun.game.gameOver')} {t('chat.fun.game.score')}: {score}
        </p>
      )}
    </div>
  )
}

function LogicQuiz({ t, questions }: { t: (key: string) => string; questions: QuizQuestion[] }) {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [selected, setSelected] = useState<number | null>(null)

  const question = questions[index]
  const isFinished = index >= questions.length
  const score = answers.filter((ans, i) => ans === questions[i]?.answer).length

  function submitAnswer() {
    if (selected === null || !question) return
    setAnswers((prev) => [...prev, selected])
    setSelected(null)
    setIndex((prev) => prev + 1)
  }

  function restartQuiz() {
    setIndex(0)
    setAnswers([])
    setSelected(null)
  }

  return (
    <div>
      <p className="mb-4 text-sm text-[#50575d]">{t('chat.fun.quiz.instructions')}</p>

      {isFinished ? (
        <div className="rounded-2xl border border-[#ebdcc9] bg-[#fdf4e8] p-5 text-center">
          <Trophy className="mx-auto mb-3 size-9 text-[#d66d28]" />
          <p className="mb-2 text-lg font-bold text-[#1f2327]">{t('chat.fun.quiz.done')}</p>
          <p className="mb-4 text-sm text-[#50575d]">{t('chat.fun.quiz.score')}: {score}/{questions.length}</p>
          <button
            type="button"
            onClick={restartQuiz}
            className="inline-flex items-center gap-2 rounded-full bg-[#d66d28] px-5 py-2 text-sm font-semibold text-white"
          >
            <RotateCcw className="size-4" />
            {t('chat.fun.quiz.restart')}
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-[#ebdcc9] bg-[#fdf4e8] p-5">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d66d28]">
            {t('chat.fun.quiz.question')} {index + 1}/{questions.length}
          </p>
          <h3 className="mb-4 text-base font-semibold text-[#1f2327] sm:text-lg">{question.q}</h3>

          <div className="grid gap-3">
            {question.options.map((option, optionIndex) => (
              <button
                key={option}
                type="button"
                onClick={() => setSelected(optionIndex)}
                className={[
                  'rounded-xl border px-4 py-3 text-left text-sm transition',
                  selected === optionIndex
                    ? 'border-[#d66d28] bg-white text-[#1f2327]'
                    : 'border-[#ebdcc9] bg-white text-[#50575d] hover:border-[#d66d28]',
                ].join(' ')}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-xs text-[#50575d]">{question.note}</p>
            <button
              type="button"
              onClick={submitAnswer}
              disabled={selected === null}
              className="rounded-full bg-[#d66d28] px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {t('chat.fun.quiz.next')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
