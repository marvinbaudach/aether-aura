import { useEffect, useRef, useState, type JSX } from 'react'
import { m, useInView, useReducedMotion } from 'framer-motion'
import { ease } from '../anim'

// A faceted sapphire — the footer's emblem. The Aura's whole story is light
// caught and bent (sapphire crystal, optical vitals, the holographic display),
// so a cut gem belongs here in a way a heart never did: each facet is shaded a
// slightly different cyan to read as refraction, a soft aura breathes beneath
// it, and a specular glint periodically sweeps across the stone. Held static
// for reduced-motion users.
const GEM_OUTLINE = 'M14 5 H34 L43 17 L24 43 L5 17 Z'

const Gem = ({ ignite }: { ignite: boolean }): JSX.Element => {
  const reduced = useReducedMotion() ?? false

  return (
    <div className="group relative grid h-16 w-16 cursor-default place-items-center">
      {/* breathing aura */}
      <m.div
        aria-hidden
        className="absolute h-14 w-14 rounded-full"
        style={{ background: 'radial-gradient(circle, oklch(0.82 0.14 205 / 0.5), transparent 68%)', filter: 'blur(6px)' }}
        animate={reduced ? undefined : { opacity: [0.4, 0.78, 0.4], scale: [0.9, 1.08, 0.9] }}
        transition={reduced ? undefined : { duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* hover glow — the stone warms when you bring a cursor near it */}
      <div
        aria-hidden
        className="absolute h-16 w-16 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: 'radial-gradient(circle, oklch(0.85 0.14 205 / 0.55), transparent 65%)', filter: 'blur(10px)' }}
      />
      {/* ignition flash: the gem fires the light that goes on to write the line */}
      {!reduced && (
        <m.div
          aria-hidden
          className="pointer-events-none absolute h-16 w-16 rounded-full"
          style={{ background: 'radial-gradient(circle, oklch(1 0.04 200 / 0.9), transparent 60%)' }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={ignite ? { opacity: [0, 0.85, 0], scale: [0.5, 1.5, 1.2] } : { opacity: 0 }}
          transition={{ duration: 0.7, ease, times: [0, 0.3, 1] }}
        />
      )}
      <svg
        viewBox="0 0 48 48" role="img" aria-label="Faceted sapphire"
        className="relative h-12 w-12 overflow-visible transition-[filter] duration-500 filter-[drop-shadow(0_4px_8px_oklch(0.13_0.013_245/0.65))] group-hover:filter-[drop-shadow(0_0_14px_oklch(0.85_0.12_205/0.7))]"
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
      {/* ignition beam: light drops from the gem above and lands on the line,
          then the horizontal blade takes over and writes the words. */}
      {start && (
        <m.span
          aria-hidden
          className="pointer-events-none absolute -top-9 left-1/2 h-9 w-[2px] origin-top -translate-x-1/2 rounded-full"
          style={{
            background: 'linear-gradient(to bottom, transparent, oklch(0.99 0.02 200) 30%, oklch(0.99 0.02 200))',
            boxShadow: '0 0 8px oklch(0.9 0.1 205), 0 0 20px oklch(0.85 0.12 205 / 0.7)',
          }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: [0, 1, 1], opacity: [0, 1, 0] }}
          transition={{ duration: 0.55, ease, times: [0, 0.5, 1] }}
        />
      )}
      <m.p
        className={cls}
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
        animate={start ? { clipPath: 'inset(0 0% 0 0)' } : { clipPath: 'inset(0 100% 0 0)' }}
        transition={{ duration: LASER_DUR, ease, delay: 0.3 }}
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
          transition={{ duration: LASER_DUR, ease, delay: 0.3, opacity: { duration: LASER_DUR, delay: 0.3, times: [0, 0.05, 0.92, 1] } }}
        />
      )}
    </div>
  )
}

const Footer = (): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion() ?? false
  const inView = useInView(ref, { once: true, margin: '-15%' })
  // Reveal is staged so the gem reads as the *source* of the light: the eyebrow
  // and gem arrive first, the gem fires an ignition flash, a beam drops to the
  // line, and only then does the laser write the words. The fine print fades in
  // once writing completes. Reduced-motion shows everything at once.
  const [igniting, setIgniting] = useState(false)
  const [writing, setWriting] = useState(false)
  const [written, setWritten] = useState(false)
  const revealed = reduced || written

  useEffect(() => {
    if (!inView || reduced) return
    const t1 = window.setTimeout(() => { setIgniting(true) }, 500)
    const t2 = window.setTimeout(() => { setWriting(true) }, 850)
    return () => { window.clearTimeout(t1); window.clearTimeout(t2) }
  }, [inView, reduced])

  // Top cluster (eyebrow + gem) leads the sequence — visible before the writing.
  const topFade = {
    initial: { opacity: 0, y: 6 },
    animate: { opacity: inView || reduced ? 1 : 0, y: inView || reduced ? 0 : 6 },
    transition: { duration: 0.8, ease },
  }
  // Fine print below the wordmark trails in after the writing completes.
  const fade = {
    initial: { opacity: 0 },
    animate: { opacity: revealed ? 1 : 0, y: revealed ? 0 : 6 },
    transition: { duration: 0.9, ease },
  }

  return (
    <footer className="relative flex min-h-svh snap-start flex-col justify-center overflow-hidden border-t border-hairline-soft px-[max(1.25rem,6vw)] py-[clamp(4rem,9vh,6.5rem)]">
      <m.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-linear-to-r from-transparent via-accent/50 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ duration: 0.9, ease }}
      />
      <div ref={ref} className="mx-auto max-w-shell text-center">
        <m.div {...topFade}>
          <p className="font-sans text-[0.74rem] uppercase tracking-[0.34em] text-accent">A concept prototype</p>
          <div className="mx-auto mt-8 flex justify-center">
            <Gem ignite={igniting} />
          </div>
        </m.div>

        <LaserLine start={writing} reduced={reduced} onDone={() => { setWritten(true) }} />

        <m.div {...fade}>
          {/* Branded sign-off: just the wordmark, so the page closes signed
              rather than trailing off — the orbit mark stays unique to the navbar. */}
          <div className="group mx-auto mt-12 flex w-fit cursor-default items-center justify-center gap-2.5 font-display text-[1rem] font-semibold tracking-[0.24em] text-ink/85">
            <span className="transition-[text-shadow] duration-500 [text-shadow:0_0_12px_oklch(0.8_0.1_205/0.4)] group-hover:[text-shadow:0_0_22px_oklch(0.85_0.12_205/0.75)]">AETHER</span>
            <span className="font-sans text-[0.66rem] font-normal uppercase tracking-[0.3em] text-faint transition-colors duration-500 group-hover:text-accent/80">Aura</span>
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
