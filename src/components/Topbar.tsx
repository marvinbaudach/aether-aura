import { useEffect, useState } from 'react'

const links = [
  { label: 'Overview', href: '#top' },
  { label: 'Technology', href: '#technology' },
  { label: 'Specs', href: '#specs' },
]

// Sticky minimal nav. Gains a subtle backdrop once the user leaves the hero.
export default function Topbar() {
  const [solid, setSolid] = useState(false)
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        solid ? 'border-b border-hairline bg-[oklch(0.165_0.013_240/0.72)] backdrop-blur-xl' : 'border-b border-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-[5vw]">
        <a href="#top" className="font-display text-[1.05rem] font-semibold tracking-[0.22em] text-ink">
          AETHER
        </a>
        <div className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <a key={l.label} href={l.href} className="font-sans text-[0.9rem] text-muted transition-colors hover:text-ink">
              {l.label}
            </a>
          ))}
          <a
            href="#reserve"
            className="rounded-full border border-accent/50 bg-accent/10 px-5 py-1.5 font-sans text-[0.9rem] font-medium text-ink transition-colors hover:bg-accent/20"
          >
            Reserve
          </a>
        </div>
      </nav>
    </header>
  )
}
