import type { JSX } from 'react'
import { m } from 'framer-motion'
import { ease } from '../anim'
import { useReducedMotion } from '../lib/useReducedMotion'

// Branded loading veil: a sweeping arc and the wordmark. On exit the wordmark
// sits dead-centre, exactly where the hero's own AETHER title lives, so it
// grows and dissolves straight into the page beneath as the veil lifts.
// Reduced-motion users get a still arc and a plain cross-fade.
const Preloader = (): JSX.Element => {
  const reduced = useReducedMotion()

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
        <m.div exit={markExit} aria-hidden className="relative h-16 w-16">
          <span className="absolute inset-0 rounded-full border border-accent/25" />
          <m.span
            className="absolute inset-0 rounded-full border-t border-accent"
            animate={reduced ? undefined : { rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.1, ease: 'linear' }}
          />
        </m.div>

        <m.p
          exit={wordExit}
          className="mt-7 font-display text-[clamp(1.4rem,4vw,2rem)] font-medium tracking-[0.42em] text-ink"
        >
          AETHER
        </m.p>
      </div>
    </m.div>
  )
}

export default Preloader
