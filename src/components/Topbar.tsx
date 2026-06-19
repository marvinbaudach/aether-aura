import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ease } from '../anim'

const links = [
  { label: 'Overview', href: '#top' },
  { label: 'Technology', href: '#technology' },
  { label: 'Specs', href: '#specs' },
]

// Sticky minimal nav. Gains a subtle backdrop once the user leaves the hero.
// On mobile the inline links collapse into a slide-down drawer, since the
// previous markup simply hid them (leaving no navigation at all < md).
export default function Topbar() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        solid || open ? 'border-b border-hairline bg-[oklch(0.165_0.013_240/0.72)] backdrop-blur-xl' : 'border-b border-transparent'
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

        {/* Mobile menu toggle */}
        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center md:hidden"
        >
          <span className="relative block h-3 w-6">
            <span className={`absolute left-0 top-0 h-px w-full bg-ink transition-transform duration-300 ${open ? 'translate-y-[6px] rotate-45' : ''}`} />
            <span className={`absolute bottom-0 left-0 h-px w-full bg-ink transition-transform duration-300 ${open ? '-translate-y-[6px] -rotate-45' : ''}`} />
          </span>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            key="drawer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease }}
            className="overflow-hidden md:hidden"
          >
            <div className="flex flex-col gap-1 px-[5vw] pb-6 pt-2">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg py-3 font-sans text-[1.05rem] text-muted transition-colors hover:bg-white/5 hover:text-ink"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#reserve"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-full border border-accent/50 bg-accent/10 px-5 py-3 text-center font-sans text-[1.05rem] font-medium text-ink"
              >
                Reserve
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
