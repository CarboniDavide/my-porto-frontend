export type MusicSong = {
  id: string
  title: string
  notes: string
  keys: string
}

type MusicSongCardProps = {
  song: MusicSong
}

export function MusicSongCard({ song }: MusicSongCardProps) {
  return (
    <article className="rounded-xl border border-[#ebdcc9] bg-white p-3 shadow-sm">
      <h4 className="text-sm font-bold text-[#1f2327]">{song.title}</h4>
      <p className="mt-2 text-xs text-[#50575d]">
        <span className="font-semibold text-[#1f2327]">Note:</span> {song.notes}
      </p>
      <p className="mt-1 font-mono text-xs tracking-wide text-[#d66d28]">
        <span className="font-semibold text-[#1f2327]">Tasti:</span> {song.keys}
      </p>
    </article>
  )
}
