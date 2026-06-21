import { useRef, useState, type JSX } from 'react'
import type { MouseEvent } from 'react'
import { m } from 'framer-motion'
import AuroraGlow from './AuroraGlow'
import Reveal from './Reveal'

// The reserve control, themed as an "ignition": a machined titanium pill with a
// single bright arc of light slowly circling its rim, a leading "first light"
// dot, and — on hover — a flood of cyan that fills the button from the left and
// lights it up (the label and arrow invert to dark for contrast). A cursor-
// tracked specular sheen rides on top. Built to feel engineered, not like a
// default glass button.
const SheenButton = ({ children }: { children: string }): JSX.Element => {
  const ref = useRef<HTMLButtonElement>(null)
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 })
  const [lit, setLit] = useState(false)

  const onMove = (e: MouseEvent<HTMLButtonElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 })
  }

  return (
    <div className="relative inline-block">
      {/* A single bright arc of light circling the rim — a machined, alive edge
          rather than a static border. Only the conic angle animates (see
          .btn-halo) so the element stays put; reduced-motion holds it still. */}
      <span aria-hidden className="btn-halo pointer-events-none absolute -inset-[2px] rounded-full" style={{ filter: 'blur(2px)' }} />

      <button
        ref={ref}
        onMouseMove={onMove}
        onMouseEnter={() => { setLit(true); }}
        onMouseLeave={() => { setLit(false); }}
        className="group relative block overflow-hidden rounded-full border border-accent/40 bg-[oklch(0.165_0.018_242)] px-12 py-5 font-sans text-[1.05rem] font-medium tracking-[0.01em] transition-transform duration-300 hover:scale-[1.03]"
      >
        {/* Ignition: cyan light floods in from the left on hover. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-[linear-gradient(100deg,oklch(0.86_0.13_200),oklch(0.7_0.15_215))] transition-transform duration-[450ms] ease-out group-hover:scale-x-100"
        />
        {/* Cursor-tracked specular sheen. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: lit ? 1 : 0,
            background: `radial-gradient(140px circle at ${String(pos.x)}% ${String(pos.y)}%, oklch(0.99 0.02 200 / 0.4), transparent 60%)`,
          }}
        />
        {/* One-shot rim glow on scroll-in to draw the eye, then settles. */}
        <m.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full"
          initial={{ boxShadow: '0 0 0px oklch(0.82 0.14 205 / 0)' }}
          whileInView={{
            boxShadow: [
              '0 0 0px oklch(0.82 0.14 205 / 0)',
              '0 0 28px oklch(0.82 0.14 205 / 0.75), inset 0 0 18px oklch(0.82 0.14 205 / 0.35)',
              '0 0 0px oklch(0.82 0.14 205 / 0)',
            ],
          }}
          viewport={{ once: true, margin: '-20%' }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        />

        <span className="relative flex items-center gap-3 text-ink transition-colors duration-300 group-hover:text-[oklch(0.16_0.02_245)]">
          {/* the "first light" — a glowing dot that inverts on ignition */}
          <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_10px_var(--accent)] transition-colors duration-300 group-hover:bg-[oklch(0.16_0.02_245)] group-hover:shadow-none" />
          {children}
          <svg viewBox="0 0 16 16" aria-hidden className="h-3.5 w-3.5 translate-x-0 transition-transform duration-300 group-hover:translate-x-1">
            <path d="M2 8h10M8 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
    </div>
  )
}

const CTA = (): JSX.Element => {
  return (
    <section id="reserve" className="relative flex min-h-svh snap-start flex-col justify-center overflow-hidden px-[max(1.25rem,6vw)] py-[clamp(4rem,9vh,6.5rem)] text-center">
      <AuroraGlow />
      <Reveal className="relative">
        <p className="font-sans text-[0.78rem] uppercase tracking-[0.42em] text-muted">First run open</p>
        <h2 className="mx-auto mt-6 max-w-[16ch] font-display text-[clamp(2.2rem,6vw,5rem)] font-medium leading-[1.04] text-gradient">
          Reserve the <span className="text-gradient-accent">first light</span>.
        </h2>
        <p className="mx-auto mt-6 max-w-[42ch] font-sans text-[1.08rem] text-muted">
          Arriving in the year 2120. Reserve yours now.
        </p>
        <div className="mt-12">
          <SheenButton>Reserve your Aura</SheenButton>
        </div>
      </Reveal>
    </section>
  )
}

export default CTA
