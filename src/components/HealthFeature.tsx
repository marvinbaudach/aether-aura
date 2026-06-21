import { useEffect, useRef, useState, type JSX } from 'react'
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

// Live heart-rate readout that drifts gently around a resting pulse so the card
// reads as a live measurement rather than a frozen number. Each update ticks the
// figure with a tiny fade so the change is felt. Static for reduced-motion.
const BpmReadout = (): JSX.Element => {
  const reduced = useReducedMotion() ?? false
  const [bpm, setBpm] = useState(72)

  useEffect(() => {
    if (reduced) return
    const id = window.setInterval(() => {
      // small organic wander, 69–75 bpm
      setBpm(69 + Math.floor(Math.random() * 7))
    }, 2000)
    return () => { window.clearInterval(id) }
  }, [reduced])

  return (
    <m.span
      key={bpm}
      className="font-display text-[clamp(2.4rem,5vw,3.4rem)] font-semibold tabular-nums text-ink"
      initial={reduced ? false : { opacity: 0.45, y: -2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease }}
    >
      {bpm}
    </m.span>
  )
}

const HealthFeature = (): JSX.Element => {
  return (
    <section id="health" className="relative bg-bg px-[max(1.25rem,6vw)] py-[clamp(4rem,12vh,10rem)]">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <p className="font-sans text-[0.74rem] uppercase tracking-[0.34em] text-accent">Health, continuous</p>
          <h2 className="mt-4 font-display text-[clamp(2rem,4.4vw,3.4rem)] font-medium leading-[1.04] text-gradient">
            Know your body by heart.
          </h2>
          <p className="mx-auto mt-6 max-w-[40ch] font-sans text-[1.08rem] text-muted">
            A single cyan beam reads your heartbeat ninety times a second — nothing
            ever touches your skin.
          </p>

          <div className="mx-auto mt-10 max-w-md rounded-3xl border border-hairline-soft bg-bg-soft p-7 text-left">
            <div className="flex items-baseline gap-2">
              <BpmReadout />
              <span className="font-sans text-[0.9rem] text-muted">BPM</span>
              <span className="pulse-dot ml-1 h-2.5 w-2.5 rounded-full bg-accent" />
            </div>
            <div className="mt-4 w-full">
              <EcgLine />
            </div>
            <p className="font-sans text-[0.82rem] text-faint">Resting · sinus rhythm</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default HealthFeature
