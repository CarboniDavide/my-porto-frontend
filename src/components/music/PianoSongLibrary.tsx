export type PianoSongOption = {
  id: string
  title: string
}

type PianoSongLibraryProps = {
  songs: PianoSongOption[]
  activeSongId: string | null
  onPlaySong: (songId: string) => void
  onStop: () => void
  labels: {
    title: string
    subtitle: string
    playPrefix: string
    playingPrefix: string
    stop: string
  }
}

export function PianoSongLibrary({ songs, activeSongId, onPlaySong, onStop, labels }: PianoSongLibraryProps) {
  return (
    <section className="mt-4 rounded-2xl border border-[#ebdcc9] bg-[#fdf4e8] p-3 sm:p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-[#d66d28]">{labels.title}</h3>
          <p className="mt-0.5 text-xs text-[#50575d]">{labels.subtitle}</p>
        </div>
        {activeSongId !== null && (
          <button
            type="button"
            onClick={onStop}
            className="shrink-0 rounded-full border border-[#d66d28] px-4 py-1.5 text-xs font-semibold text-[#d66d28] transition hover:bg-[#d66d28] hover:text-white"
          >
            {labels.stop}
          </button>
        )}
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {songs.map((song) => (
          <button
            key={song.id}
            type="button"
            onClick={() => onPlaySong(song.id)}
            className={[
              'rounded-xl border px-4 py-3 text-sm font-semibold transition',
              activeSongId === song.id
                ? 'border-[#d66d28] bg-[#d66d28] text-white'
                : 'border-[#ebdcc9] bg-white text-[#1f2327] hover:-translate-y-0.5',
            ].join(' ')}
          >
            {activeSongId === song.id
              ? `${labels.playingPrefix}: ${song.title}`
              : `${labels.playPrefix}: ${song.title}`}
          </button>
        ))}
      </div>
    </section>
  )
}
