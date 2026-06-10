import { useEffect, useRef, useState } from 'react'
import { Brain, Gamepad2, MessageCircle, Music2, RotateCcw, Trophy } from 'lucide-react'
import { ChatInput } from './ChatInput'
import { PianoSongLibrary, type PianoSongOption } from './music/PianoSongLibrary'

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
  const songTimersRef = useRef<number[]>([])
  const [activeKeys, setActiveKeys] = useState<string[]>([])
  const [autoActiveKeys, setAutoActiveKeys] = useState<string[]>([])
  const [activeSongId, setActiveSongId] = useState<string | null>(null)

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

  type SongStep = { noteId: (typeof keys)[number]['id']; beats: number }

  const whiteKeyWidth = `${100 / 15}%`

  const sampleSongs: Array<PianoSongOption & { melody: SongStep[] }> = [
    {
      id: 'happy-birthday',
      title: t('chat.fun.piano.examples.songs.happyBirthday') as string,
      melody: [
        { noteId: 'G3', beats: 1 },
        { noteId: 'G3', beats: 1 },
        { noteId: 'A3', beats: 2 },
        { noteId: 'G3', beats: 2 },
        { noteId: 'C4', beats: 2 },
        { noteId: 'B3', beats: 4 },
        { noteId: 'G3', beats: 1 },
        { noteId: 'G3', beats: 1 },
        { noteId: 'A3', beats: 2 },
        { noteId: 'G3', beats: 2 },
        { noteId: 'D4', beats: 2 },
        { noteId: 'C4', beats: 4 },
        { noteId: 'G3', beats: 1 },
        { noteId: 'G3', beats: 1 },
        { noteId: 'G4', beats: 2 },
        { noteId: 'E4', beats: 2 },
        { noteId: 'C4', beats: 2 },
        { noteId: 'B3', beats: 2 },
        { noteId: 'A3', beats: 4 },
        { noteId: 'F4', beats: 1 },
        { noteId: 'F4', beats: 1 },
        { noteId: 'E4', beats: 2 },
        { noteId: 'C4', beats: 2 },
        { noteId: 'D4', beats: 2 },
        { noteId: 'C4', beats: 4 },
      ],
    },
    {
      id: 'sandstorm',
      title: t('chat.fun.piano.examples.songs.sandstorm') as string,
      melody: [
        // Phrase 1 — iconic rapid 4-note burst
        { noteId: 'B4', beats: 0.25 },
        { noteId: 'B4', beats: 0.25 },
        { noteId: 'B4', beats: 0.25 },
        { noteId: 'B4', beats: 0.25 },
        { noteId: 'A4', beats: 0.5 },
        { noteId: 'B4', beats: 1 },
        { noteId: 'G4', beats: 0.5 },
        { noteId: 'A4', beats: 0.25 },
        { noteId: 'A4', beats: 0.25 },
        { noteId: 'A4', beats: 0.25 },
        { noteId: 'A4', beats: 0.25 },
        { noteId: 'G4', beats: 0.5 },
        { noteId: 'A4', beats: 1 },
        { noteId: 'E4', beats: 2 },
        // Phrase 2 — repeat with variation
        { noteId: 'B4', beats: 0.25 },
        { noteId: 'B4', beats: 0.25 },
        { noteId: 'B4', beats: 0.25 },
        { noteId: 'B4', beats: 0.25 },
        { noteId: 'A4', beats: 0.5 },
        { noteId: 'B4', beats: 1 },
        { noteId: 'G4', beats: 0.5 },
        { noteId: 'A4', beats: 0.25 },
        { noteId: 'A4', beats: 0.25 },
        { noteId: 'G4', beats: 0.25 },
        { noteId: 'A4', beats: 0.25 },
        { noteId: 'B4', beats: 1 },
        { noteId: 'A4', beats: 0.5 },
        { noteId: 'G4', beats: 0.5 },
        { noteId: 'F#4', beats: 0.5 },
        { noteId: 'E4', beats: 2 },
        // Phrase 3 — build up with lower register
        { noteId: 'E4', beats: 0.25 },
        { noteId: 'F#4', beats: 0.25 },
        { noteId: 'G4', beats: 0.25 },
        { noteId: 'A4', beats: 0.25 },
        { noteId: 'B4', beats: 0.5 },
        { noteId: 'A4', beats: 0.5 },
        { noteId: 'G4', beats: 0.5 },
        { noteId: 'F#4', beats: 0.5 },
        { noteId: 'E4', beats: 1 },
        { noteId: 'D4', beats: 0.5 },
        { noteId: 'E4', beats: 0.5 },
        { noteId: 'B3', beats: 2 },
      ],
    },
    {
      id: 'video-killed',
      title: t('chat.fun.piano.examples.songs.videoKilled') as string,
      melody: [
        // Iconic synth intro riff
        { noteId: 'A4', beats: 0.5 },
        { noteId: 'G4', beats: 0.5 },
        { noteId: 'E4', beats: 1 },
        { noteId: 'D4', beats: 0.5 },
        { noteId: 'E4', beats: 0.5 },
        { noteId: 'G4', beats: 1 },
        { noteId: 'A4', beats: 2 },
        // Second bar
        { noteId: 'A4', beats: 0.5 },
        { noteId: 'G4', beats: 0.5 },
        { noteId: 'E4', beats: 1 },
        { noteId: 'D4', beats: 0.5 },
        { noteId: 'E4', beats: 0.5 },
        { noteId: 'D4', beats: 1 },
        { noteId: 'C4', beats: 2 },
        // Third bar — rises
        { noteId: 'C4', beats: 0.5 },
        { noteId: 'D4', beats: 0.5 },
        { noteId: 'E4', beats: 0.5 },
        { noteId: 'G4', beats: 0.5 },
        { noteId: 'A4', beats: 1 },
        { noteId: 'C5', beats: 2 },
        // Fourth bar — descends back
        { noteId: 'B4', beats: 0.5 },
        { noteId: 'A4', beats: 0.5 },
        { noteId: 'G4', beats: 0.5 },
        { noteId: 'F#4', beats: 0.5 },
        { noteId: 'E4', beats: 1 },
        { noteId: 'A3', beats: 2 },
      ],
    },
  ]

  const noteById = new Map(keys.map((note) => [note.id, note]))

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

  function clearSongPlayback() {
    songTimersRef.current.forEach((timerId) => window.clearTimeout(timerId))
    songTimersRef.current = []
    activeNodesRef.current.forEach((_, noteId) => stopNote(noteId))
    setAutoActiveKeys([])
    setActiveSongId(null)
  }

  function playSong(songId: string) {
    const song = sampleSongs.find((candidate) => candidate.id === songId)
    if (!song) return

    clearSongPlayback()
    setActiveSongId(song.id)
    void getAudioContext().resume()

    const beatMs = 300
    let elapsed = 0

    song.melody.forEach((step) => {
      const note = noteById.get(step.noteId)
      if (!note) {
        elapsed += step.beats * beatMs
        return
      }

      const startTimer = window.setTimeout(() => {
        setAutoActiveKeys((prev) => (prev.includes(note.id) ? prev : [...prev, note.id]))
        playNote(note.id, note.freq)
      }, elapsed)

      const stopTimer = window.setTimeout(() => {
        setAutoActiveKeys((prev) => prev.filter((id) => id !== note.id))
        stopNote(note.id)
      }, elapsed + step.beats * beatMs * 0.86)

      songTimersRef.current.push(startTimer, stopTimer)
      elapsed += step.beats * beatMs
    })

    const endTimer = window.setTimeout(() => {
      setAutoActiveKeys([])
      setActiveSongId(null)
      songTimersRef.current = []
    }, elapsed + 40)

    songTimersRef.current.push(endTimer)
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
      clearSongPlayback()
    }
  }, [])

  return (
    <div>
      <p className="mb-4 text-sm text-[#50575d]">{t('chat.fun.piano.instructions') as string}</p>
      <div className="relative mx-auto h-48 w-full max-w-6xl overflow-hidden rounded-2xl border border-[#ebdcc9] bg-[#fdf4e8]">
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
              autoActiveKeys.includes(note.id)
                ? 'bg-[#ffbf85] ring-2 ring-inset ring-[#d66d28]'
                : activeKeys.includes(note.id)
                  ? 'bg-[#ffd9b8]'
                  : 'hover:bg-[#fff4e8]',
            ].join(' ')}
            style={{ left: `${note.left}%`, width: whiteKeyWidth }}
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
              'absolute top-0 z-10 h-[62%] w-[4.5%] rounded-b-lg bg-[#1f2327] text-[10px] font-bold uppercase text-white transition',
              autoActiveKeys.includes(note.id)
                ? 'bg-[#ff8a3b] ring-2 ring-inset ring-[#ffd3b0]'
                : activeKeys.includes(note.id)
                  ? 'bg-[#d66d28]'
                  : 'hover:bg-[#2e343a]',
            ].join(' ')}
            style={{ left: `${note.left}%` }}
          >
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2">{note.key}</span>
          </button>
        ))}
      </div>

      <PianoSongLibrary
        songs={sampleSongs.map(({ id, title }) => ({ id, title }))}
        activeSongId={activeSongId}
        onPlaySong={playSong}
        onStop={clearSongPlayback}
        labels={{
          title: t('chat.fun.piano.examples.title') as string,
          subtitle: t('chat.fun.piano.examples.subtitle') as string,
          playPrefix: t('chat.fun.piano.examples.playPrefix') as string,
          playingPrefix: t('chat.fun.piano.examples.playingPrefix') as string,
          stop: t('chat.fun.piano.examples.stop') as string,
        }}
      />
    </div>
  )
}

function MiniRunner({ t }: { t: FunnyPlayProps['t'] }) {
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
    ctx.fillText(`${t('chat.fun.game.score') as string}: ${g.score}`, 10, 22)

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
      <p className="mb-3 text-sm text-[#50575d]">{t('chat.fun.game.instructions') as string}</p>
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
          {isRunning ? (t('chat.fun.game.pause') as string) : (t('chat.fun.game.play') as string)}
        </button>
        <button
          type="button"
          onClick={() => {
            resetGame()
            setIsRunning(false)
          }}
          className="rounded-full border border-[#ebdcc9] bg-white px-5 py-2 text-sm font-semibold text-[#1f2327]"
        >
          {t('chat.fun.game.reset') as string}
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
          {t('chat.fun.game.gameOver') as string} {t('chat.fun.game.score') as string}: {score}
        </p>
      )}
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
