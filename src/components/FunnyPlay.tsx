import { useEffect, useRef, useState } from 'react'
import { Brain, Gamepad2, MessageCircle, Music2, RotateCcw, Trophy } from 'lucide-react'
import { ChatInput } from './ChatInput'

type ActivityMode = 'chat' | 'piano' | 'game' | 'quiz'
type QuizQuestion = { q: string; options: string[]; answer: number; note: string }

type FunnyPlayProps = {
  t: any
  inputPlaceholder: string
  onSend: (content: string) => Promise<void>
  onReset: () => void
  isLoading: boolean
}

const FALLBACK_QUIZ: QuizQuestion[] = [
  {
    q: 'Which number completes the pattern: 2, 6, 12, 20, ?',
    options: ['28', '30', '32', '36'],
    answer: 1,
    note: 'Pattern is n(n+1): 1x2, 2x3, 3x4, 4x5, 5x6 = 30.',
  },
  {
    q: 'If all Bloops are Razzies and all Razzies are Lazzies, then all Bloops are...',
    options: ['Not Lazzies', 'Lazzies', 'Only sometimes Lazzies', 'None of the above'],
    answer: 1,
    note: 'Classic transitive syllogism.',
  },
  {
    q: 'A bat and a ball cost 1.10 total. Bat costs 1.00 more than ball. Ball costs...',
    options: ['0.05', '0.10', '0.15', '0.20'],
    answer: 0,
    note: 'If ball = x, bat = x + 1.00, total 1.10, so x = 0.05.',
  },
  {
    q: 'Find the odd one out: Triangle, Square, Pentagon, Circle',
    options: ['Triangle', 'Square', 'Pentagon', 'Circle'],
    answer: 3,
    note: 'Circle has no edges/vertices unlike polygons.',
  },
  {
    q: 'What comes next: AZ, BY, CX, DW, ?',
    options: ['EV', 'FU', 'GV', 'EZ'],
    answer: 0,
    note: 'First letter increments, second letter decrements.',
  },
]

export function FunnyPlay({ t, inputPlaceholder, onSend, onReset, isLoading }: FunnyPlayProps) {
  const [mode, setMode] = useState<ActivityMode>('chat')
  const quizQuestions =
    (t('chat.fun.quiz.questions', { returnObjects: true }) as QuizQuestion[]) || FALLBACK_QUIZ

  const modes: Array<{ id: ActivityMode; label: string; icon: typeof MessageCircle }> = [
    { id: 'chat', label: t('chat.fun.modes.chat') as string, icon: MessageCircle },
    { id: 'piano', label: t('chat.fun.modes.piano') as string, icon: Music2 },
    { id: 'game', label: t('chat.fun.modes.game') as string, icon: Gamepad2 },
    { id: 'quiz', label: t('chat.fun.modes.quiz') as string, icon: Brain },
  ]

  return (
    <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-2 sm:px-6">
      <div className="w-full max-w-5xl px-3 py-6 sm:px-6 sm:py-5">
        <h1 className="mb-6 text-center font-serif text-xl font-bold text-white sm:text-3xl">
          {t('chat.title') as string}
        </h1>
        <p className="mx-auto mb-6 max-w-3xl text-center text-sm text-[#fffaf4] sm:text-base">
          {t('chat.fun.subtitle') as string}
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
              onSend={onSend}
              onReset={onReset}
              showUpload={false}
              showReset={false}
              disabled={isLoading}
            />
          )}

          {mode === 'piano' && <PianoPlayground t={t} />}

          {mode === 'game' && <MiniRunner t={t} />}

          {mode === 'quiz' && (
            <LogicQuiz
              t={t}
              questions={quizQuestions.length > 0 ? quizQuestions : FALLBACK_QUIZ}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function PianoPlayground({ t }: { t: FunnyPlayProps['t'] }) {
  const audioContextRef = useRef<AudioContext | null>(null)
  const activeNodesRef = useRef<Map<string, { oscillators: OscillatorNode[]; gain: GainNode }>>(
    new Map(),
  )
  const [activeKeys, setActiveKeys] = useState<string[]>([])
  const [isMobilePortrait, setIsMobilePortrait] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 640 && window.innerHeight > window.innerWidth,
  )

  const keys = [
    { id: 'C3', key: 'z', freq: 130.81, type: 'white', left: 0 },
    { id: 'C#3', key: 's', freq: 138.59, type: 'black', left: 4.42 },
    { id: 'D3', key: 'x', freq: 146.83, type: 'white', left: 6.67 },
    { id: 'D#3', key: 'd', freq: 155.56, type: 'black', left: 11.08 },
    { id: 'E3', key: 'c', freq: 164.81, type: 'white', left: 13.33 },
    { id: 'F3', key: 'v', freq: 174.61, type: 'white', left: 20 },
    { id: 'F#3', key: 'g', freq: 185.0, type: 'black', left: 24.42 },
    { id: 'G3', key: 'b', freq: 196.0, type: 'white', left: 26.67 },
    { id: 'G#3', key: 'h', freq: 207.65, type: 'black', left: 31.08 },
    { id: 'A3', key: 'n', freq: 220.0, type: 'white', left: 33.33 },
    { id: 'A#3', key: 'j', freq: 233.08, type: 'black', left: 37.75 },
    { id: 'B3', key: 'm', freq: 246.94, type: 'white', left: 40 },
    { id: 'C4', key: ',', freq: 261.63, type: 'white', left: 46.67 },
    { id: 'C#4', key: 'l', freq: 277.18, type: 'black', left: 47.75 },
    { id: 'D4', key: '.', freq: 293.66, type: 'white', left: 53.33 },
    { id: 'D#4', key: ';', freq: 311.13, type: 'black', left: 54.42 },
    { id: 'E4', key: '/', freq: 329.63, type: 'white', left: 60 },
    { id: 'F4', key: 'q', freq: 349.23, type: 'white', left: 66.67 },
    { id: 'F#4', key: '2', freq: 369.99, type: 'black', left: 67.75 },
    { id: 'G4', key: 'w', freq: 392.0, type: 'white', left: 73.33 },
    { id: 'G#4', key: '3', freq: 415.3, type: 'black', left: 74.42 },
    { id: 'A4', key: 'e', freq: 440.0, type: 'white', left: 80 },
    { id: 'A#4', key: '4', freq: 466.16, type: 'black', left: 81.08 },
    { id: 'B4', key: 'r', freq: 493.88, type: 'white', left: 86.67 },
    { id: 'C5', key: 't', freq: 523.25, type: 'white', left: 93.33 },
  ] as const

  const mobileSubset = new Set(['C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3', 'C4', 'C#4', 'D4', 'D#4', 'E4'])
  const displayedKeys = isMobilePortrait
    ? keys.map((k) => ({ ...k, left: k.left * 1.5 })).filter((k) => mobileSubset.has(k.id))
    : [...keys]
  const whiteKeyWidth = `${100 / displayedKeys.filter((k) => k.type === 'white').length}%`
  const blackKeyWidth = isMobilePortrait ? '6.5%' : '4.5%'

  function getAudioContext() {
    if (!audioContextRef.current) audioContextRef.current = new AudioContext()
    return audioContextRef.current
  }

  function playNote(noteId: string, freq: number) {
    if (activeNodesRef.current.has(noteId)) return
    const context = getAudioContext()
    const now = context.currentTime
    const gain = context.createGain()

    const filter = context.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(5200, now)
    filter.Q.value = 0.8

    const panner = context.createStereoPanner()
    const pan = Math.min(0.8, Math.max(-0.8, (Math.log2(freq / 440) / 2) * 0.55))
    panner.pan.setValueAtTime(pan, now)

    const velocity = 0.9 + Math.random() * 0.2
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.linearRampToValueAtTime(0.62 * velocity, now + 0.006)
    gain.gain.exponentialRampToValueAtTime(0.26 * velocity, now + 0.14)
    gain.gain.exponentialRampToValueAtTime(0.0012, now + 2.1)

    const partials = [
      { multiple: 1, level: 1.0, type: 'triangle' as OscillatorType, detune: -2.5 },
      { multiple: 1, level: 0.6, type: 'sine' as OscillatorType, detune: 2.5 },
      { multiple: 2, level: 0.28, type: 'sine' as OscillatorType, detune: 0 },
      { multiple: 3.01, level: 0.08, type: 'sine' as OscillatorType, detune: -1 },
    ]

    const oscillators = partials.map(({ multiple, level, type, detune }) => {
      const osc = context.createOscillator()
      const partialGain = context.createGain()
      osc.type = type
      osc.frequency.setValueAtTime(freq * multiple, now)
      osc.detune.setValueAtTime(detune, now)
      partialGain.gain.setValueAtTime(level, now)
      osc.connect(partialGain)
      partialGain.connect(gain)
      osc.start(now)
      return osc
    })

    const noiseBuffer = context.createBuffer(1, Math.floor(context.sampleRate * 0.03), context.sampleRate)
    const noiseData = noiseBuffer.getChannelData(0)
    for (let i = 0; i < noiseData.length; i += 1) {
      noiseData[i] = (Math.random() * 2 - 1) * Math.exp((-14 * i) / noiseData.length)
    }
    const noise = context.createBufferSource()
    noise.buffer = noiseBuffer
    const noiseFilter = context.createBiquadFilter()
    noiseFilter.type = 'bandpass'
    noiseFilter.frequency.setValueAtTime(2300, now)
    noiseFilter.Q.setValueAtTime(1.2, now)
    const noiseGain = context.createGain()
    noiseGain.gain.setValueAtTime(0.04 * velocity, now)
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03)
    noise.connect(noiseFilter)
    noiseFilter.connect(noiseGain)
    noiseGain.connect(gain)
    noise.start(now)
    noise.stop(now + 0.035)

    gain.connect(filter)
    filter.connect(panner)
    panner.connect(context.destination)

    activeNodesRef.current.set(noteId, { oscillators, gain })
    setActiveKeys((prev) => (prev.includes(noteId) ? prev : [...prev, noteId]))
  }

  function stopNote(noteId: string) {
    const current = activeNodesRef.current.get(noteId)
    if (!current) return
    const context = getAudioContext()
    current.gain.gain.cancelScheduledValues(context.currentTime)
    current.gain.gain.setValueAtTime(Math.max(current.gain.gain.value, 0.0001), context.currentTime)
    current.gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.22)
    current.oscillators.forEach((osc) => {
      osc.stop(context.currentTime + 0.24)
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
      activeNodesRef.current.forEach((_, noteId) => stopNote(noteId))
    }
  }, [])

  useEffect(() => {
    function check() {
      setIsMobilePortrait(window.innerWidth < 640 && window.innerHeight > window.innerWidth)
    }
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <div>
      <p className="mb-4 text-sm text-[#50575d]">{t('chat.fun.piano.instructions') as string}</p>
      <div className="relative mx-auto h-48 w-full max-w-6xl overflow-hidden rounded-2xl border border-[#ebdcc9] bg-[#fdf4e8]">
        {displayedKeys.filter((k) => k.type === 'white').map((note) => (
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
            style={{ left: `${note.left}%`, width: whiteKeyWidth }}
          >
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2">{note.key}</span>
          </button>
        ))}

        {displayedKeys.filter((k) => k.type === 'black').map((note) => (
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
              'absolute top-0 z-10 h-[62%] rounded-b-lg bg-[#1f2327] text-[10px] font-bold uppercase text-white transition',
              activeKeys.includes(note.id) ? 'bg-[#d66d28]' : 'hover:bg-[#2e343a]',
            ].join(' ')}
            style={{ left: `${note.left}%`, width: blackKeyWidth }}
          >
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2">{note.key}</span>
          </button>
        ))}
      </div>

    </div>
  )
}

function MiniRunner({ t }: { t: FunnyPlayProps['t'] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number | null>(null)
  const stateRef = useRef<'idle' | 'running' | 'over'>('idle')
  const gameRef = useRef({
    y: 0, vy: 0, jumpsLeft: 2,
    obstacles: [] as { x: number; w: number; h: number }[],
    speed: 4, frame: 0, nextAt: 100, leg: 0,
  })

  const [phase, setPhase] = useState<'idle' | 'running' | 'over'>('idle')
  const [score, setScore] = useState(0)

  const GROUND = 28
  const PW = 30, PH = 34

  function groundY(h: number) { return h - GROUND - PH }

  function doJump() {
    const g = gameRef.current
    if (g.jumpsLeft > 0) { g.vy = -11; g.jumpsLeft-- }
  }

  function startGame() {
    const c = canvasRef.current; if (!c) return
    const g = gameRef.current
    g.y = groundY(c.height); g.vy = 0; g.jumpsLeft = 2
    g.obstacles = []; g.speed = 4; g.frame = 0; g.nextAt = 100; g.leg = 0
    setScore(0)
    stateRef.current = 'running'
    setPhase('running')
  }

  function interact() {
    const s = stateRef.current
    if (s === 'idle' || s === 'over') { startGame(); return }
    doJump()
  }

  function drawFox(ctx: CanvasRenderingContext2D, x: number, y: number, leg: number, dead: boolean) {
    const hx = x + 15
    // body
    ctx.fillStyle = '#d66d28'
    ctx.beginPath(); ctx.ellipse(hx, y + 22, 12, 9, 0, 0, Math.PI * 2); ctx.fill()
    // head
    ctx.beginPath(); ctx.arc(hx + 2, y + 10, 10, 0, Math.PI * 2); ctx.fill()
    // ears
    ctx.beginPath(); ctx.moveTo(hx - 3, y + 3); ctx.lineTo(hx - 7, y - 5); ctx.lineTo(hx + 1, y + 2); ctx.closePath(); ctx.fill()
    ctx.beginPath(); ctx.moveTo(hx + 7, y + 3); ctx.lineTo(hx + 11, y - 5); ctx.lineTo(hx + 3, y + 2); ctx.closePath(); ctx.fill()
    ctx.fillStyle = '#f4a261'
    ctx.beginPath(); ctx.moveTo(hx - 3, y + 2); ctx.lineTo(hx - 5, y - 1); ctx.lineTo(hx, y + 1); ctx.closePath(); ctx.fill()
    ctx.beginPath(); ctx.moveTo(hx + 7, y + 2); ctx.lineTo(hx + 9, y - 1); ctx.lineTo(hx + 4, y + 1); ctx.closePath(); ctx.fill()
    // muzzle
    ctx.fillStyle = '#fdf4e8'
    ctx.beginPath(); ctx.ellipse(hx + 3, y + 13, 5, 4, 0, 0, Math.PI * 2); ctx.fill()
    // eyes
    if (dead) {
      ctx.strokeStyle = '#1f2327'; ctx.lineWidth = 1.5
      for (const [ex, ey] of [[hx - 2, y + 8], [hx + 6, y + 8]] as [number, number][]) {
        ctx.beginPath(); ctx.moveTo(ex - 2, ey - 2); ctx.lineTo(ex + 2, ey + 2); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(ex + 2, ey - 2); ctx.lineTo(ex - 2, ey + 2); ctx.stroke()
      }
    } else {
      ctx.fillStyle = '#1f2327'
      ctx.beginPath(); ctx.arc(hx - 2, y + 8, 2, 0, Math.PI * 2); ctx.fill()
      ctx.beginPath(); ctx.arc(hx + 6, y + 8, 2, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = 'white'
      ctx.beginPath(); ctx.arc(hx - 1, y + 7, 0.8, 0, Math.PI * 2); ctx.fill()
      ctx.beginPath(); ctx.arc(hx + 7, y + 7, 0.8, 0, Math.PI * 2); ctx.fill()
    }
    // nose
    ctx.fillStyle = '#1f2327'
    ctx.beginPath(); ctx.ellipse(hx + 3, y + 14, 1.5, 1, 0, 0, Math.PI * 2); ctx.fill()
    // tail
    ctx.strokeStyle = '#d66d28'; ctx.lineWidth = 5; ctx.lineCap = 'round'
    ctx.beginPath(); ctx.moveTo(x + 3, y + 27); ctx.quadraticCurveTo(x - 8, y + 21, x - 2, y + 13); ctx.stroke()
    ctx.strokeStyle = '#fdf4e8'; ctx.lineWidth = 2.5
    ctx.beginPath(); ctx.moveTo(x - 3, y + 13); ctx.lineTo(x - 2, y + 10); ctx.stroke()
    // legs
    const sw = Math.sin(leg) * 5
    ctx.fillStyle = '#c05e20'
    ctx.beginPath(); ctx.rect(x + 16, y + 28, 5, Math.max(1, 8 + sw)); ctx.fill()
    ctx.beginPath(); ctx.rect(x + 9, y + 28, 5, Math.max(1, 8 - sw)); ctx.fill()
  }

  function drawCactus(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
    ctx.fillStyle = '#40916c'
    const sw = Math.max(7, w * 0.38)
    const sx = x + (w - sw) / 2
    ctx.beginPath(); ctx.rect(sx, y, sw, h); ctx.fill()
    if (h > 26) {
      ctx.beginPath(); ctx.rect(x, y + 10, sx - x + 1, 6); ctx.fill()
      ctx.beginPath(); ctx.rect(x, y + 4, 7, 12); ctx.fill()
      ctx.beginPath(); ctx.rect(sx + sw - 1, y + 6, x + w - sx - sw + 1, 6); ctx.fill()
      ctx.beginPath(); ctx.rect(x + w - 7, y + 2, 7, 11); ctx.fill()
    }
  }

  function render(dead = false) {
    const c = canvasRef.current; if (!c) return
    const ctx = c.getContext('2d'); if (!ctx) return
    const g = gameRef.current
    const gY = c.height - GROUND

    ctx.fillStyle = '#fdf4e8'; ctx.fillRect(0, 0, c.width, c.height)

    // clouds
    ctx.fillStyle = '#f0e6d8'
    const co = (g.frame * 0.4) % (c.width + 100)
    for (const [cx2, cy2, r] of [[120, 28, 18], [350, 40, 14], [500, 22, 20]] as [number, number, number][]) {
      const cx3 = ((cx2 - co + c.width + 100) % (c.width + 100)) - 20
      ctx.beginPath(); ctx.arc(cx3, cy2, r, 0, Math.PI * 2); ctx.fill()
      ctx.beginPath(); ctx.arc(cx3 + r * 0.9, cy2 - r * 0.3, r * 0.65, 0, Math.PI * 2); ctx.fill()
      ctx.beginPath(); ctx.arc(cx3 + r * 1.7, cy2, r * 0.75, 0, Math.PI * 2); ctx.fill()
    }

    // ground
    ctx.fillStyle = '#ebdcc9'; ctx.fillRect(0, gY, c.width, GROUND)
    ctx.fillStyle = '#d4c4b0'; ctx.fillRect(0, gY, c.width, 2)
    const dOff = (g.frame * g.speed * 0.6) % 40
    for (let dx = -dOff; dx < c.width; dx += 40) ctx.fillRect(dx, gY + 8, 18, 1)

    for (const obs of g.obstacles) drawCactus(ctx, obs.x, gY - obs.h, obs.w, obs.h)

    drawFox(ctx, 80 - PW / 2, g.y, g.leg, dead)

    ctx.fillStyle = '#50575d'; ctx.font = 'bold 13px sans-serif'
    ctx.textAlign = 'right'; ctx.fillText(String(Math.floor(g.frame / 6)), c.width - 14, 22); ctx.textAlign = 'left'
  }

  function tick() {
    if (stateRef.current !== 'running') return
    const c = canvasRef.current; if (!c) return
    const g = gameRef.current
    const gY = groundY(c.height)

    g.vy += 0.55; g.y = Math.min(g.y + g.vy, gY)
    if (g.y >= gY) { g.vy = 0; g.jumpsLeft = 2 }
    g.frame++; g.speed = Math.min(4 + g.frame / 200, 10)
    g.leg += g.y >= gY ? 0.28 : 0.08

    if (g.frame >= g.nextAt) {
      const h = 22 + Math.random() * 28
      g.obstacles.push({ x: c.width + 20, w: 18 + Math.random() * 12, h })
      g.nextAt = g.frame + Math.max(38, 90 - g.frame / 30) + Math.random() * 50
    }
    for (const o of g.obstacles) o.x -= g.speed
    g.obstacles = g.obstacles.filter((o) => o.x + o.w > -10)

    const margin = 5
    for (const obs of g.obstacles) {
      const obsY = c.height - GROUND - obs.h
      if (
        80 - PW / 2 + margin < obs.x + obs.w &&
        80 - PW / 2 + PW - margin > obs.x &&
        g.y + PH - margin > obsY &&
        g.y + margin < obsY + obs.h
      ) {
        stateRef.current = 'over'; setPhase('over'); setScore(Math.floor(g.frame / 6))
        render(true); return
      }
    }

    setScore(Math.floor(g.frame / 6))
    render(false)
    rafRef.current = requestAnimationFrame(tick)
  }

  useEffect(() => {
    const c = canvasRef.current
    if (c) { gameRef.current.y = groundY(c.height); render() }
  }, [])

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'ArrowUp') { e.preventDefault(); interact() }
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [])

  useEffect(() => {
    if (phase !== 'running') { if (rafRef.current) cancelAnimationFrame(rafRef.current); return }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [phase])

  return (
    <div>
      <p className="mb-3 text-sm text-[#50575d]">{t('chat.fun.game.instructions') as string}</p>
      <div
        className="relative mx-auto cursor-pointer select-none overflow-hidden rounded-2xl border border-[#ebdcc9]"
        style={{ touchAction: 'none' }}
        onClick={interact}
        onTouchStart={(e) => { e.preventDefault(); interact() }}
      >
        <canvas ref={canvasRef} width={600} height={180} className="block w-full" />
        {phase === 'idle' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full bg-[#d66d28] px-5 py-2 text-sm font-semibold text-white shadow-md">
              {t('chat.fun.game.play') as string} ▶
            </span>
          </div>
        )}
        {phase === 'over' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#1f2327]/40">
            <p className="text-sm font-bold text-white drop-shadow">{t('chat.fun.game.gameOver') as string}</p>
            <p className="text-xs text-white drop-shadow">{t('chat.fun.game.score') as string}: {score}</p>
            <span className="mt-1 rounded-full bg-[#d66d28] px-4 py-1.5 text-sm font-semibold text-white">
              {t('chat.fun.game.reset') as string} ↩
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

function LogicQuiz({ t, questions }: { t: FunnyPlayProps['t']; questions: QuizQuestion[] }) {
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
      <p className="mb-4 text-sm text-[#50575d]">{t('chat.fun.quiz.instructions') as string}</p>

      {isFinished ? (
        <div className="rounded-2xl border border-[#ebdcc9] bg-[#fdf4e8] p-5 text-center">
          <Trophy className="mx-auto mb-3 size-9 text-[#d66d28]" />
          <p className="mb-2 text-lg font-bold text-[#1f2327]">{t('chat.fun.quiz.done') as string}</p>
          <p className="mb-4 text-sm text-[#50575d]">{t('chat.fun.quiz.score') as string}: {score}/{questions.length}</p>
          <button
            type="button"
            onClick={restartQuiz}
            className="inline-flex items-center gap-2 rounded-full bg-[#d66d28] px-5 py-2 text-sm font-semibold text-white"
          >
            <RotateCcw className="size-4" />
            {t('chat.fun.quiz.restart') as string}
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-[#ebdcc9] bg-[#fdf4e8] p-5">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d66d28]">
            {t('chat.fun.quiz.question') as string} {index + 1}/{questions.length}
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
              {t('chat.fun.quiz.next') as string}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
