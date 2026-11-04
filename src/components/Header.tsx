import { Navbar } from './Navbar'

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center border-b border-[#ebdcc9] bg-[#fffaf4]/90 backdrop-blur-sm">
      <Navbar />
    </header>
  )
}
