import { useRef, type JSX } from 'react'
import { m, useInView, useReducedMotion } from 'framer-motion'
import { ease } from '../anim'
import { useCountUp } from '../lib/useCountUp'
import Reveal from './Reveal'

const BatteryRing = (): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-20%' })
  const reduced = useReducedMotion() ?? false

  const R = 132
  const C = 2 * Math.PI * R
  // The cell never depletes, so the ring sits permanently full — it reads as a
  // power gauge that simply never empties.
  const pct = 1

  const half = useCountUp(50, inView, 1400, reduced)
  const charges = useCountUp(0, inView, 1400, reduced)
  const uptime = useCountUp(100, inView, 1400, reduced)

  const stats = [
    { value: half, suffix: 'yr', label: 'radioisotope half-life, sealed for good' },
    { value: charges, suffix: '', label: 'cables, adapters or charging nights' },
    { value: uptime, suffix: '%', label: 'always-on — day, night and every year after' },
  ]

  return (
    <section ref={ref} className="relative bg-bg px-[max(1.25rem,6vw)] py-[clamp(5rem,14vh,12rem)]">
      <div className="mx-auto max-w-shell">
        <Reveal className="mb-14 text-center">
          <p className="font-sans text-[0.74rem] uppercase tracking-[0.34em] text-accent">Power</p>
          <h2 className="mx-auto mt-4 max-w-[20ch] font-display text-[clamp(2rem,4.6vw,3.6rem)] font-medium leading-[1.04] text-gradient">
            Never charged. Never opened. Never off.
          </h2>
          <p className="mx-auto mt-6 max-w-[52ch] font-sans text-[1.05rem] text-muted">
            A sealed radioisotope cell powers the Aura from a sliver of fuel — no
            port, no cable, no charging ritual. Strap it on once and let it run
            for decades.
          </p>
        </Reveal>

        <div className="grid items-center gap-14 md:grid-cols-2">
          <div className="relative mx-auto grid place-items-center">
            <svg viewBox="0 0 300 300" className="h-[clamp(15rem,40vw,20rem)] w-[clamp(15rem,40vw,20rem)] -rotate-90">
              <circle cx="150" cy="150" r={R} stroke="var(--ring-track)" strokeWidth="14" fill="none" />
              <m.circle
                cx="150" cy="150" r={R}
                stroke="var(--accent)" strokeWidth="14" fill="none" strokeLinecap="round"
                strokeDasharray={C}
                initial={{ strokeDashoffset: C }}
                animate={inView ? { strokeDashoffset: C * (1 - pct) } : {}}
                transition={{ duration: reduced ? 0 : 1.6, ease, delay: reduced ? 0 : 0.2 }}
                style={{ filter: 'drop-shadow(0 0 10px color-mix(in oklab, var(--accent) 60%, transparent))' }}
              />
            </svg>
            <div className="absolute inset-0 grid place-items-center text-center">
              <div>
                <p className="font-sans text-[0.8rem] uppercase tracking-[0.3em] text-muted">Runs for</p>
                <p className="font-display text-[clamp(4rem,14vw,7rem)] font-semibold leading-none text-ink">∞</p>
                <p className="font-sans text-[0.9rem] text-muted">a lifetime, sealed</p>
              </div>
            </div>
          </div>

          <div className="grid gap-5">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08} className="flex items-baseline gap-5 rounded-2xl border border-hairline-soft bg-bg-soft px-7 py-6">
                <span className="font-display text-[clamp(2.2rem,4vw,3rem)] font-semibold text-accent tabular-nums">
                  {s.value}
                  <span className="ml-1 text-[0.5em] text-muted">{s.suffix}</span>
                </span>
                <span className="font-sans text-[1rem] text-muted">{s.label}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default BatteryRing
