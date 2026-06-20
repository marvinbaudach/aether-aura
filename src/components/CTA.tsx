import { useRef, useState, type JSX } from 'react'
import type { MouseEvent } from 'react'
import Reveal from './Reveal'

// Specular sheen that tracks the cursor across the reserve button.
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
    <button
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => { setLit(true); }}
      onMouseLeave={() => { setLit(false); }}
      className="relative overflow-hidden rounded-full border border-accent/45 bg-bg-lift px-12 py-5 font-sans text-[1.05rem] font-medium tracking-[0.01em] text-ink transition-transform duration-300 hover:scale-[1.03]"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: lit ? 1 : 0,
          background: `radial-gradient(130px circle at ${String(pos.x)}% ${String(pos.y)}%, oklch(0.82 0.135 205 / 0.5), transparent 60%)`,
        }}
      />
      <span className="relative">{children}</span>
    </button>
  )
}

const CTA = (): JSX.Element => {
  return (
    <section id="reserve" className="relative overflow-hidden px-[max(1.25rem,6vw)] py-[clamp(7rem,16vh,16rem)] text-center">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[50vh] w-[80vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,oklch(0.7_0.15_205/0.18),transparent_70%)] blur-3xl" />
      <Reveal className="relative">
        <p className="font-sans text-[0.78rem] uppercase tracking-[0.42em] text-muted">First run open</p>
        <h2 className="mx-auto mt-6 max-w-[16ch] font-display text-[clamp(2.2rem,6vw,5rem)] font-medium leading-[1.04] text-gradient">
          Reserve the <span className="text-gradient-accent">first light</span>.
        </h2>
        <p className="mx-auto mt-6 max-w-[42ch] font-sans text-[1.08rem] text-muted">
          A refundable hold secures one of the first five hundred. We ship in the
          order they land.
        </p>
        <div className="mt-12">
          <SheenButton>Reserve your Aura</SheenButton>
        </div>
        <p className="mt-6 font-sans text-[0.82rem] text-faint">From $1,290 · fully refundable</p>
      </Reveal>
    </section>
  )
}

export default CTA
