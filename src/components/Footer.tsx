import { useRef, useState, type JSX } from 'react'
import { m, useInView, useReducedMotion } from 'framer-motion'
import { ease } from '../anim'

// A faceted sapphire — the footer's emblem. The Aura's whole story is light
// caught and bent (sapphire crystal, optical vitals, the holographic display),
// so a cut gem belongs here in a way a heart never did: each facet is shaded a
// slightly different cyan to read as refraction, a soft aura breathes beneath
// it, and a specular glint periodically sweeps across the stone. Held static
// for reduced-motion users.
const GEM_OUTLINE = 'M14 5 H34 L43 17 L24 43 L5 17 Z'

const Gem = (): JSX.Element => {
  const reduced = useReducedMotion() ?? false

  return (
    <div className="relative grid h-16 w-16 place-items-center">
      {/* breathing aura */}
      <m.div
        aria-hidden
        className="absolute h-14 w-14 rounded-full"
        style={{ background: 'radial-gradient(circle, oklch(0.82 0.14 205 / 0.5), transparent 68%)', filter: 'blur(6px)' }}
        animate={reduced ? undefined : { opacity: [0.4, 0.78, 0.4], scale: [0.9, 1.08, 0.9] }}
        transition={reduced ? undefined : { duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <svg
        viewBox="0 0 48 48" role="img" aria-label="Faceted sapphire"
        className="relative h-12 w-12 overflow-visible"
        style={{ filter: 'drop-shadow(0 4px 8px oklch(0.13 0.013 245 / 0.65))' }}
      >
        <defs>
          <linearGradient id="gemTable" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.99 0.03 200)" />
            <stop offset="100%" stopColor="oklch(0.86 0.12 202)" />
          </linearGradient>
          <linearGradient id="gemCrownL" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.91 0.09 205)" />
            <stop offset="100%" stopColor="oklch(0.64 0.14 216)" />
          </linearGradient>
          <linearGradient id="gemCrownR" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.94 0.08 200)" />
            <stop offset="100%" stopColor="oklch(0.70 0.14 212)" />
          </linearGradient>
          <linearGradient id="gemPavL" x1="0" y1="0" x2="0.6" y2="1">
            <stop offset="0%" stopColor="oklch(0.74 0.13 210)" />
            <stop offset="100%" stopColor="oklch(0.40 0.11 226)" />
          </linearGradient>
          <linearGradient id="gemPavC" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.92 0.10 200)" />
            <stop offset="100%" stopColor="oklch(0.50 0.13 218)" />
          </linearGradient>
          <linearGradient id="gemPavR" x1="1" y1="0" x2="0.4" y2="1">
            <stop offset="0%" stopColor="oklch(0.79 0.12 208)" />
            <stop offset="100%" stopColor="oklch(0.45 0.12 223)" />
          </linearGradient>
          <clipPath id="gemClip"><path d={GEM_OUTLINE} /></clipPath>
        </defs>

        {/* crown facets */}
        <polygon points="5,17 14,5 14,17" fill="url(#gemCrownL)" />
        <polygon points="14,5 34,5 34,17 14,17" fill="url(#gemTable)" />
        <polygon points="34,5 43,17 34,17" fill="url(#gemCrownR)" />
        {/* pavilion facets */}
        <polygon points="5,17 14,17 24,43" fill="url(#gemPavL)" />
        <polygon points="14,17 34,17 24,43" fill="url(#gemPavC)" />
        <polygon points="34,17 43,17 24,43" fill="url(#gemPavR)" />

        {/* facet edges catch the light */}
        <g stroke="oklch(0.99 0.02 200 / 0.45)" strokeWidth="0.5" fill="none">
          <path d="M5 17 H43" />
          <path d="M14 5 V17" />
          <path d="M34 5 V17" />
          <path d="M14 17 L24 43" />
          <path d="M34 17 L24 43" />
        </g>

        {/* girdle + outline */}
        <path d={GEM_OUTLINE} fill="none" stroke="oklch(0.99 0.02 200 / 0.85)" strokeWidth="0.8" strokeLinejoin="round" />

        {/* specular glint sweeping across the stone */}
        {!reduced && (
          <g clipPath="url(#gemClip)">
            <m.rect
              y="-4" width="9" height="56" fill="oklch(1 0 0 / 0.6)"
              style={{ filter: 'blur(1.5px)' }}
              transform="rotate(20 24 24)"
              animate={{ x: [-26, 54] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3.2, ease: 'easeInOut' }}
            />
          </g>
        )}
      </svg>
    </div>
  )
}

// "Measured in light." literally drawn by light: as the line scrolls in, a
// clip wipes the text into existence from left to right while a thin, bright
// laser rides the building edge. Calls onDone when the writing finishes so the
// rest of the footer can fade in. Reduced-motion users get the static line.
const LASER_DUR = 1.7
const LaserLine = ({ start, reduced, onDone }: { start: boolean; reduced: boolean; onDone: () => void }): JSX.Element => {
  const cls =
    'max-w-[20ch] font-display text-[clamp(2.4rem,7vw,5rem)] font-medium leading-[0.98] text-gradient'

  if (reduced) return <p className={`mx-auto mt-6 ${cls}`}>Measured in light.</p>

  return (
    <div className="relative mx-auto mt-6 w-fit">
      <m.p
        className={cls}
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
        animate={start ? { clipPath: 'inset(0 0% 0 0)' } : { clipPath: 'inset(0 100% 0 0)' }}
        transition={{ duration: LASER_DUR, ease }}
        onAnimationComplete={() => { if (start) onDone() }}
      >
        Measured in light.
      </m.p>
      {/* the laser: a thin glowing blade tracking the writing edge */}
      {start && (
        <m.span
          aria-hidden
          className="pointer-events-none absolute inset-y-[-6%] w-[3px] rounded-full"
          style={{
            background: 'linear-gradient(to bottom, transparent, oklch(0.99 0.02 200) 18%, oklch(0.99 0.02 200) 82%, transparent)',
            boxShadow: '0 0 10px oklch(0.92 0.08 200), 0 0 26px oklch(0.85 0.12 205 / 0.8)',
          }}
          initial={{ left: '0%', opacity: 0 }}
          animate={{ left: '100%', opacity: [0, 1, 1, 0] }}
          transition={{ duration: LASER_DUR, ease, opacity: { duration: LASER_DUR, times: [0, 0.05, 0.92, 1] } }}
        />
      )}
    </div>
  )
}

const Footer = (): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion() ?? false
  const inView = useInView(ref, { once: true, margin: '-15%' })
  // The footer starts empty; once the laser finishes writing the wordmark, the
  // surrounding content fades in. Reduced-motion shows everything at once.
  const [written, setWritten] = useState(false)
  const revealed = reduced || written

  // Eyebrow + heart sit above the wordmark, the divider + fine print below;
  // both groups fade in together after the writing completes.
  const fade = {
    initial: { opacity: 0 },
    animate: { opacity: revealed ? 1 : 0, y: revealed ? 0 : 6 },
    transition: { duration: 0.9, ease },
  }

  return (
    <footer className="relative overflow-hidden border-t border-hairline-soft px-[max(1.25rem,6vw)] py-[clamp(5rem,14vh,11rem)]">
      <m.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[1px] w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-accent/50 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ duration: 0.9, ease }}
      />
      <div ref={ref} className="mx-auto max-w-shell text-center">
        <m.div {...fade}>
          <p className="font-sans text-[0.74rem] uppercase tracking-[0.34em] text-accent">A concept prototype</p>
          <div className="mx-auto mt-8 flex justify-center">
            <Gem />
          </div>
        </m.div>

        <LaserLine start={inView} reduced={reduced} onDone={() => { setWritten(true) }} />

        <m.div {...fade}>
          {/* Branded sign-off: the same orbit mark from the navbar, so the page
              closes signed rather than trailing off into a plain divider. */}
          <div className="mx-auto mt-12 flex items-center justify-center gap-2.5 font-display text-[1rem] font-semibold tracking-[0.24em] text-ink/85">
            <span className="grid h-5 w-5 place-items-center rounded-full border border-accent/50">
              <span className="block h-1 w-1 rounded-full bg-accent" />
            </span>
            <span style={{ textShadow: '0 0 12px oklch(0.8 0.1 205 / 0.4)' }}>AETHER</span>
            <span className="ml-0.5 font-sans text-[0.66rem] font-normal uppercase tracking-[0.3em] text-faint">Aura</span>
          </div>
          <p className="mt-9 font-sans text-[0.8rem] text-faint">
            © 2026 AETHER · Aura. All renders and footage are AI-generated.
          </p>
          <p className="mt-2 font-mono text-[0.7rem] text-faint/60">{__COMMIT_SHA__}</p>
        </m.div>
      </div>
    </footer>
  )
}

export default Footer
