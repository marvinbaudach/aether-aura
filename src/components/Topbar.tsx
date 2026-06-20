import { useEffect, useState, type JSX } from 'react'

// Sticky minimal header. Shows just the wordmark; gains a glass backdrop once
// the user leaves the hero.
const Topbar = (): JSX.Element => {
  const [solid, setSolid] = useState(false)

  useEffect(() => {
    const onScroll = () => { setSolid(window.scrollY > window.innerHeight * 0.55); }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); }
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        solid
          ? 'border-b border-hairline-soft bg-[oklch(0.145_0.014_245/0.72)] backdrop-blur-xl'
          : 'border-b border-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-shell items-center px-[max(1.25rem,5vw)]">
        <a href="#top" className="group flex items-center gap-2.5 font-display text-[1.05rem] font-semibold tracking-[0.22em] text-ink">
          <span id="brand-mark" className="grid h-6 w-6 place-items-center rounded-full border border-accent/50">
            <span className="block h-1.5 w-1.5 rounded-full bg-accent transition-transform duration-300 group-hover:scale-125" />
          </span>
          <span id="brand-word">AETHER</span>
        </a>
      </nav>
    </header>
  )
}

export default Topbar
