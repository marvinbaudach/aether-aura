import { useLayoutEffect, useRef, useState } from 'react'
import type { JSX } from 'react'
import { m, useReducedMotion } from 'framer-motion'
import { ease } from '../anim'

interface Flight {
  x: number
  y: number
  scale: number
}

// Three particles evenly spaced around the ring.
const ORBIT = [0, 120, 240]

// Branded loading veil. The mark breathes — a sweeping arc, an orbit of
// particles and a pulsing core. On exit the mark flies to the Topbar's logo
// (measured at mount) and the veil dissolves, handing the loader off into the
// page's own brand mark. Reduced-motion users get a plain cross-fade.
const Preloader = (): JSX.Element => {
  const reduced = useReducedMotion() ?? false
  const markRef = useRef<HTMLDivElement>(null)
  const wordRef = useRef<HTMLParagraphElement>(null)
  const [flight, setFlight] = useState<{ mark: Flight; word: Flight }>({
    mark: { x: 0, y: 0, scale: 0.375 },
    word: { x: 0, y: 0, scale: 0.5 },
  })

  useLayoutEffect(() => {
    // Centre-to-centre delta + width ratio from a loader element to its landing
    // spot in the Topbar.
    const measure = (el: HTMLElement | null, targetId: string): Flight | null => {
      const target = document.getElementById(targetId)
      if (!el || !target) return null
      const a = el.getBoundingClientRect()
      const b = target.getBoundingClientRect()
      return {
        x: b.left + b.width / 2 - (a.left + a.width / 2),
        y: b.top + b.height / 2 - (a.top + a.height / 2),
        scale: b.width / a.width,
      }
    }
    const mark = measure(markRef.current, 'brand-mark')
    const word = measure(wordRef.current, 'brand-word')
    if (mark && word) setFlight({ mark, word })
  }, [])

  const flyTransition = { duration: 0.85, ease, opacity: { delay: 0.6, duration: 0.25 } }
  const markExit = reduced
    ? { opacity: 0, transition: { duration: 0.4 } }
    : { x: flight.mark.x, y: flight.mark.y, scale: flight.mark.scale, opacity: 0, transition: flyTransition }
  const wordExit = reduced
    ? { opacity: 0, transition: { duration: 0.4 } }
    : { x: flight.word.x, y: flight.word.y, scale: flight.word.scale, opacity: 0, transition: flyTransition }

  return (
    <m.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: reduced ? 0.4 : 0.5, delay: reduced ? 0 : 0.6 } }}
      className="fixed inset-0 z-[60] grid place-items-center overflow-hidden bg-bg"
    >
      <div className="relative flex flex-col items-center">
        <m.div ref={markRef} exit={markExit} className="relative grid h-16 w-16 place-items-center">
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
          ref={wordRef}
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
