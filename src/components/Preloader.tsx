import type { JSX } from 'react'
import { m, useReducedMotion } from 'framer-motion'
import { ease } from '../anim'

// Three particles evenly spaced around the ring.
const ORBIT = [0, 120, 240]

// Branded loading veil. The mark breathes — a sweeping arc, an orbit of
// particles and a pulsing core. On exit nothing flies off-screen: the wordmark
// sits dead-centre, exactly where the hero's own AETHER title lives, so it
// grows and dissolves straight into the page beneath as the veil lifts. No
// persistent header to hand off to — the loader resolves into the hero itself.
// Reduced-motion users get a plain cross-fade.
const Preloader = (): JSX.Element => {
  const reduced = useReducedMotion() ?? false

  const handoff = { duration: 0.85, ease, opacity: { delay: 0.45, duration: 0.4 } }
  const markExit = reduced
    ? { opacity: 0, transition: { duration: 0.4 } }
    : { scale: 1.35, opacity: 0, transition: handoff }
  // Grows toward the hero's far larger wordmark so the eye reads it as the same
  // mark settling into place rather than a new title appearing.
  const wordExit = reduced
    ? { opacity: 0, transition: { duration: 0.4 } }
    : { scale: 1.8, opacity: 0, transition: handoff }

  return (
    <m.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: reduced ? 0.4 : 0.5, delay: reduced ? 0 : 0.7 } }}
      className="fixed inset-0 z-60 grid place-items-center overflow-hidden bg-bg"
    >
      <div className="relative flex flex-col items-center">
        <m.div exit={markExit} className="relative grid h-16 w-16 place-items-center">
          {/* faint static ring */}
          <span className="absolute inset-0 rounded-full border border-accent/25" />

          {/* sweeping arc */}
          <m.span
            className="absolute inset-0 rounded-full border-t border-accent"
            animate={reduced ? undefined : { rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.1, ease: 'linear' }}
          />

          {/* counter-rotating orbit of particles */}
          {!reduced && (
            <m.div
              className="absolute inset-0"
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 3.2, ease: 'linear' }}
            >
              {ORBIT.map((deg) => (
                <span
                  key={deg}
                  className="absolute left-1/2 top-1/2 h-1 w-1 rounded-full bg-accent/80"
                  style={{ transform: `translate(-50%, -50%) rotate(${String(deg)}deg) translateY(-30px)` }}
                />
              ))}
            </m.div>
          )}

          {/* pulsing core */}
          <m.span
            className="block h-2 w-2 rounded-full bg-accent"
            animate={reduced ? undefined : { opacity: [0.3, 1, 0.3], boxShadow: ['0 0 0px var(--accent)', '0 0 20px var(--accent)', '0 0 0px var(--accent)'] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          />
        </m.div>

        <m.p
          exit={wordExit}
          className="mt-7 font-display text-[clamp(1.4rem,4vw,2rem)] font-medium tracking-[0.42em] text-ink"
          style={{ textShadow: '0 0 18px oklch(0.95 0.02 230 / 0.9), 0 0 45px oklch(0.85 0.08 205 / 0.7), 0 0 90px oklch(0.7 0.12 205 / 0.55)' }}
          animate={reduced ? undefined : { opacity: [0.95, 1, 0.95] }}
          transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
        >
          AETHER
        </m.p>
        <m.p
          exit={{ opacity: 0, y: 8, transition: { duration: 0.3 } }}
          className="mt-3 font-sans text-[0.7rem] uppercase tracking-[0.4em] text-faint"
        >
          Aura · forming
        </m.p>
      </div>
    </m.div>
  )
}

export default Preloader
