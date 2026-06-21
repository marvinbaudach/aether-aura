import { useRef, type JSX } from 'react'
import { m, useInView, useReducedMotion } from 'framer-motion'
import { ease } from '../anim'
import Reveal from './Reveal'

const ECG_PATH =
  'M0 60 H70 l12 -4 l10 8 l14 -52 l12 92 l13 -44 l10 0 H210 l12 -4 l10 8 l14 -52 l12 92 l13 -44 l10 0 H360'

// Animated single-lead ECG trace. The waveform draws on first view, then a
// bright "scanner" dash runs along the same path on a loop (held static for
// reduced-motion users).
const EcgLine = (): JSX.Element => {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15%' })
  const reduced = useReducedMotion() ?? false

  return (
    <svg ref={ref} viewBox="0 0 360 120" className="h-24 w-full" fill="none" aria-hidden>
      <defs>
        <linearGradient id="ecgGrad" x1="0" x2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0" />
          <stop offset="50%" stopColor="oklch(0.9 0.1 200)" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* base trace draws in */}
      <m.path
        d={ECG_PATH}
        stroke="color-mix(in oklab, var(--accent) 35%, transparent)"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: reduced ? 0 : 1.6, ease }}
      />
      {/* scanner highlight loops along the trace */}
      {inView && !reduced && (
        <m.path
          d={ECG_PATH}
          stroke="url(#ecgGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="0.12 0.88"
          initial={{ strokeDashoffset: 1 }}
          animate={{ strokeDashoffset: [1, -0.12] }}
          transition={{ duration: 2.2, ease: 'linear', repeat: Infinity, delay: 1.4 }}
        />
      )}
    </svg>
  )
}

const RINGS = [
  { r: 52, color: 'oklch(0.82 0.14 205)', pct: 0.82, label: 'Move' },
  { r: 40, color: 'oklch(0.7 0.15 230)', pct: 0.66, label: 'Beat' },
  { r: 28, color: 'oklch(0.88 0.1 195)', pct: 0.9, label: 'Breathe' },
]

const Rings = (): JSX.Element => {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15%' })
  const reduced = useReducedMotion() ?? false

  return (
    <svg ref={ref} viewBox="0 0 140 140" className="h-36 w-36 -rotate-90" aria-hidden>
      {RINGS.map((ring) => {
        const c = 2 * Math.PI * ring.r
        return (
          <g key={ring.r}>
            <circle cx="70" cy="70" r={ring.r} stroke="var(--ring-track)" strokeWidth="9" fill="none" />
            <m.circle
              cx="70" cy="70" r={ring.r}
              stroke={ring.color} strokeWidth="9" fill="none" strokeLinecap="round"
              strokeDasharray={c}
              initial={{ strokeDashoffset: c }}
              animate={inView ? { strokeDashoffset: c * (1 - ring.pct) } : {}}
              transition={{ duration: reduced ? 0 : 1.4, ease, delay: reduced ? 0 : 0.2 }}
              style={{ filter: `drop-shadow(0 0 6px ${ring.color})` }}
            />
          </g>
        )
      })}
    </svg>
  )
}

const HealthFeature = (): JSX.Element => {
  return (
    <section id="health" className="relative bg-bg px-[max(1.25rem,6vw)] py-[clamp(4rem,12vh,10rem)]">
      <div className="mx-auto grid max-w-shell items-center gap-12 md:grid-cols-2 md:gap-16">
        <Reveal>
          <p className="font-sans text-[0.74rem] uppercase tracking-[0.34em] text-accent">Health, continuous</p>
          <h2 className="mt-4 font-display text-[clamp(2rem,4.4vw,3.4rem)] font-medium leading-[1.04] text-gradient">
            Know your body by heart.
          </h2>
          <p className="mt-6 max-w-[46ch] font-sans text-[1.08rem] text-muted">
            An optical emitter pulses a single cyan beam through the skin to read
            your heartbeat ninety times a second — then sleeps between readings to
            protect the cell. No contacts ever touch your wrist.
          </p>

          <div className="mt-10 grid grid-cols-[auto_1fr] items-center gap-7 rounded-3xl border border-hairline-soft bg-bg-soft p-7">
            <Rings />
            <div>
              <div className="flex items-baseline gap-2">
                <m.span
                  className="font-display text-[clamp(2.4rem,5vw,3.4rem)] font-semibold text-ink"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  72
                </m.span>
                <span className="font-sans text-[0.9rem] text-muted">BPM</span>
                <span className="pulse-dot ml-1 h-2.5 w-2.5 rounded-full bg-accent" />
              </div>
              <div className="mt-4 w-full">
                <EcgLine />
              </div>
              <p className="font-sans text-[0.82rem] text-faint">Resting · sinus rhythm</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="relative">
          <div className="relative overflow-hidden rounded-[28px] border border-hairline-soft">
            <picture>
              <source type="image/webp" srcSet="assets/aura_health_800.webp 800w, assets/aura_health_1200.webp 1200w" sizes="(max-width: 767px) 90vw, 45vw" />
              <img src="assets/aura_health_1000.jpg" alt="The Aura showing a live ECG waveform and heart rate" className="block aspect-[3/4] w-full object-cover" loading="lazy" decoding="async" />
            </picture>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default HealthFeature
