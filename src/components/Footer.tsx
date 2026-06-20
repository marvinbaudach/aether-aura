import type { JSX } from 'react'
import { m } from 'framer-motion'
import { ease } from '../anim'

const groups = [
  { h: 'Product', items: ['Overview', 'Design', 'Health', 'Hologram', 'Tech Specs'] },
  { h: 'Buy', items: ['Reserve', 'Finishes', 'Bands', 'Trade-in'] },
  { h: 'Support', items: ['Setup', 'Warranty', 'Contact', 'Registration'] },
]

const Footer = (): JSX.Element => {
  return (
    <footer className="border-t border-hairline-soft px-[max(1.25rem,6vw)] py-16">
      <m.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease }}
        className="mx-auto max-w-shell"
      >
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="font-display text-[clamp(1.8rem,4.5vw,2.6rem)] font-semibold leading-none tracking-[0.16em]">AETHER</p>
            <p className="mt-3 font-sans text-[0.82rem] uppercase tracking-[0.3em] text-muted">Aura · Measured in light</p>
          </div>
          {groups.map((g) => (
            <div key={g.h}>
              <p className="font-sans text-[0.74rem] uppercase tracking-[0.28em] text-faint">{g.h}</p>
              <ul className="mt-4 space-y-2.5">
                {g.items.map((it) => (
                  <li key={it}>
                    <a href="#top" className="font-sans text-[0.95rem] text-muted transition-colors hover:text-ink">{it}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-hairline-soft pt-7 md:flex-row md:items-center">
          <p className="font-sans text-[0.8rem] text-faint">© 2026 AETHER. A concept prototype. All renders and footage are AI-generated.</p>
          <p className="font-sans text-[0.8rem] text-faint">Designed where elegance meets the future.</p>
        </div>
      </m.div>
    </footer>
  )
}

export default Footer
