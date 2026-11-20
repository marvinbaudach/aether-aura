import { useRef, type JSX } from 'react'
import { m, useInView } from 'framer-motion'
import { ease } from '../anim'
import { useReducedMotion } from '../lib/useReducedMotion'

const ECG_PATH =
  'M0 60 H70 l12 -4 l10 8 l14 -52 l12 92 l13 -44 l10 0 H210 l12 -4 l10 8 l14 -52 l12 92 l13 -44 l10 0 H360'

// Single-lead ECG trace. The waveform draws once on first view (drawn in full
// for reduced-motion users).
const EcgLine = (): JSX.Element => {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15%' })
  const reduced = useReducedMotion()

  return (
    <svg ref={ref} viewBox="0 0 360 120" className="h-24 w-full" fill="none" aria-hidden>
      {/* base trace draws in */}
      <m.path
        d={ECG_PATH}
        stroke="var(--accent)"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: reduced ? 0 : 1.6, ease }}
      />
    </svg>
  )
}

const HealthFeature = (): JSX.Element => {
  return (
    <section id="health" className="cv-section relative flex min-h-svh flex-col justify-center bg-bg px-[max(1.25rem,6vw)] py-[clamp(4rem,9vh,6.5rem)]">
      <div className="mx-auto grid w-full max-w-shell items-center gap-10 md:grid-cols-2 md:gap-16">
        <div>
          <h2 className="max-w-[16ch] font-display text-[clamp(2rem,4.4vw,3.4rem)] font-medium leading-[1.04]">
            Know your body by heart.
          </h2>
          <p className="mt-6 max-w-[40ch] font-sans text-[1.08rem] text-muted">
            A single cyan beam reads your heartbeat. Nothing ever touches your
            skin.
          </p>
        </div>

        <div className="w-full max-w-md rounded-2xl border border-hairline-soft bg-bg-soft p-7 text-left md:justify-self-end">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-[clamp(1.75rem,3vw,2.2rem)] font-semibold tabular-nums text-ink">72</span>
            <span className="font-sans text-[0.9rem] text-muted">BPM</span>
          </div>
          <div className="mt-4 w-full">
            <EcgLine />
          </div>
          <p className="font-sans text-[0.85rem] text-muted">Resting · sinus rhythm</p>
        </div>
      </div>
    </section>
  )
}

export default HealthFeature
