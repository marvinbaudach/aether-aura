import { useRef, type JSX } from 'react'
import { m, useInView, useReducedMotion } from 'framer-motion'
import { ease } from '../anim'
import { useCountUp } from '../lib/useCountUp'
import Reveal from './Reveal'

const INF_PATH =
  'M30 30 C30 14 52 14 60 30 C68 46 90 46 90 30 C90 14 68 14 60 30 C52 46 30 46 30 30 Z'

// The "lifetime" mark, alive: the lemniscate first draws itself in, then a
// bright beam loops endlessly around both lobes — a clearer "never stops" cue
// than the static ∞ glyph it replaces.
const InfinityMark = ({ inView, reduced }: { inView: boolean; reduced: boolean }): JSX.Element => (
  <svg viewBox="0 0 120 60" className="mx-auto h-[clamp(3.5rem,12vw,6rem)] w-auto" fill="none" role="img" aria-label="Runs forever">
    <defs>
      <linearGradient id="infBeam" x1="0" x2="1">
        <stop offset="0%" stopColor="var(--accent)" stopOpacity="0" />
        <stop offset="50%" stopColor="oklch(0.94 0.12 195)" />
        <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
      </linearGradient>
    </defs>
    <m.path
      d={INF_PATH}
      stroke="color-mix(in oklab, var(--accent) 32%, transparent)"
      strokeWidth="6" strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={inView ? { pathLength: 1 } : {}}
      transition={{ duration: reduced ? 0 : 1.5, ease }}
    />
    {inView && !reduced && (
      <m.path
        d={INF_PATH}
        stroke="url(#infBeam)" strokeWidth="7" strokeLinecap="round"
        pathLength={1} strokeDasharray="0.2 0.8"
        initial={{ strokeDashoffset: 0 }}
        animate={{ strokeDashoffset: -1 }}
        transition={{ duration: 2.6, ease: 'linear', repeat: Infinity, repeatType: 'loop', delay: 1.3 }}
        style={{ filter: 'drop-shadow(0 0 8px var(--accent))' }}
      />
    )}
  </svg>
)

const BatteryRing = (): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null)
  // Trigger off the ring itself, not the whole (tall) section — otherwise on
  // small screens the sweep finishes while the ring is still below the fold and
  // the visitor only ever catches its end state.
  const vizRef = useRef<HTMLDivElement>(null)
  const inView = useInView(vizRef, { once: true, margin: '0px 0px -25% 0px' })
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
          <div ref={vizRef} className="relative mx-auto grid place-items-center">
            <svg viewBox="-30 -30 360 360" className="h-[clamp(15rem,40vw,20rem)] w-[clamp(15rem,40vw,20rem)] -rotate-90 overflow-visible">
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
              {/* Endless travelling arc — once the ring is full, a bright comet
                  keeps orbiting it, echoing the looping ∞ in the centre. */}
              {inView && !reduced && (
                <m.circle
                  cx="150" cy="150" r={R}
                  stroke="oklch(0.94 0.12 195)" strokeWidth="14" fill="none" strokeLinecap="round"
                  pathLength={1} strokeDasharray="0.12 0.88"
                  style={{ filter: 'drop-shadow(0 0 12px var(--accent))' }}
                  initial={{ strokeDashoffset: 0, opacity: 0 }}
                  animate={{ strokeDashoffset: -1, opacity: 1 }}
                  transition={{
                    strokeDashoffset: { duration: 3.4, ease: 'linear', repeat: Infinity, repeatType: 'loop', delay: 1.4 },
                    opacity: { duration: 0.6, delay: 1.4 },
                  }}
                />
              )}
            </svg>
            <div className="absolute inset-0 grid place-items-center text-center">
              <div>
                <p className="font-sans text-[0.8rem] uppercase tracking-[0.3em] text-muted">Runs for</p>
                <div className="my-2"><InfinityMark inView={inView} reduced={reduced} /></div>
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
