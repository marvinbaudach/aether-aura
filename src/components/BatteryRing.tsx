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
  const pct = 0.86

  const full = useCountUp(40, inView, 1400, reduced)
  const low = useCountUp(62, inView, 1400, reduced)
  const fast = useCountUp(8, inView, 1400, reduced)

  const stats = [
    { value: full, suffix: 'hrs', label: 'normal use on a full charge' },
    { value: low, suffix: 'hrs', label: 'in Low Power Mode' },
    { value: fast, suffix: 'hrs', label: 'from a 15-minute fast charge' },
  ]

  return (
    <section ref={ref} className="relative bg-bg px-[max(1.25rem,6vw)] py-[clamp(5rem,14vh,12rem)]">
      <div className="mx-auto max-w-shell">
        <Reveal className="mb-14 text-center">
          <p className="font-sans text-[0.74rem] uppercase tracking-[0.34em] text-accent">Battery</p>
          <h2 className="mx-auto mt-4 max-w-[18ch] font-display text-[clamp(2rem,4.6vw,3.6rem)] font-medium leading-[1.04] text-gradient">
            All day. All night. Always a positive.
          </h2>
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
                <p className="font-sans text-[0.8rem] uppercase tracking-[0.3em] text-muted">Up to</p>
                <p className="font-display text-[clamp(3.5rem,12vw,6rem)] font-semibold leading-none text-ink tabular-nums">{full}</p>
                <p className="font-sans text-[0.9rem] text-muted">hours</p>
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
