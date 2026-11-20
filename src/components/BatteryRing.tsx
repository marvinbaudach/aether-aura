import { useRef, type JSX } from 'react'
import { m, useInView } from 'framer-motion'
import { ease } from '../anim'
import { useReducedMotion } from '../lib/useReducedMotion'

const INF_PATH =
  'M30 30 C30 14 52 14 60 30 C68 46 90 46 90 30 C90 14 68 14 60 30 C52 46 30 46 30 30 Z'

// The "lifetime" mark: the lemniscate draws itself once on first view.
const InfinityMark = ({ inView, reduced }: { inView: boolean; reduced: boolean }): JSX.Element => (
  <svg viewBox="0 0 120 60" className="mx-auto h-[clamp(3.5rem,12vw,6rem)] w-auto" fill="none" role="img" aria-label="Runs forever">
    <m.path
      d={INF_PATH}
      stroke="var(--accent)"
      strokeWidth="6" strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={inView ? { pathLength: 1 } : {}}
      transition={{ duration: reduced ? 0 : 1.5, ease }}
    />
  </svg>
)

const R = 132
const C = 2 * Math.PI * R

const BatteryRing = (): JSX.Element => {
  // Trigger off the ring itself, not the whole (tall) section, so on small
  // screens the sweep does not finish while the ring is still below the fold.
  const vizRef = useRef<HTMLDivElement>(null)
  const inView = useInView(vizRef, { once: true, margin: '0px 0px -25% 0px' })
  const reduced = useReducedMotion()

  return (
    <section className="cv-section relative flex min-h-svh flex-col justify-center bg-bg px-[max(1.25rem,6vw)] py-[clamp(4rem,9vh,6.5rem)]">
      <div className="mx-auto grid w-full max-w-shell items-center gap-12 md:grid-cols-2 md:gap-16">
        <div>
          <h2 className="max-w-[16ch] font-display text-[clamp(2rem,4.4vw,3.4rem)] font-medium leading-[1.04]">
            Powered by a sealed radioisotope cell.
          </h2>
          <p className="mt-6 max-w-[46ch] font-sans text-[1.05rem] text-muted">
            The cell holds a sliver of fuel with a 50-year half-life. The Aura
            has no port and no cable, so there is nothing to plug in. Strap it
            on once and let it run for decades.
          </p>
        </div>

        <div ref={vizRef} className="relative mx-auto grid place-items-center">
          <svg viewBox="-30 -30 360 360" aria-hidden className="h-[clamp(15rem,40vw,20rem)] w-[clamp(15rem,40vw,20rem)] -rotate-90 overflow-visible">
            <circle cx="150" cy="150" r={R} stroke="var(--ring-track)" strokeWidth="14" fill="none" />
            <m.circle
              cx="150" cy="150" r={R}
              stroke="var(--accent)" strokeWidth="14" fill="none" strokeLinecap="round"
              strokeDasharray={C}
              initial={{ strokeDashoffset: C }}
              animate={inView ? { strokeDashoffset: 0 } : {}}
              transition={{ duration: reduced ? 0 : 1.6, ease, delay: reduced ? 0 : 0.2 }}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <p className="font-sans text-[0.9rem] text-muted">Runs for</p>
              <div className="my-2"><InfinityMark inView={inView} reduced={reduced} /></div>
              <p className="font-sans text-[0.9rem] text-muted">a lifetime, sealed</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BatteryRing
