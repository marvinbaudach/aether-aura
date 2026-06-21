import { useRef, useState, type JSX } from 'react'
import { m, useInView, useReducedMotion } from 'framer-motion'
import { ease } from '../anim'

// Teal heart that pulses on a realistic "lub-dub" cadence: a strong first beat,
// a softer second, then a rest — the same double-thump the optical vitals engine
// reads. Held static for reduced-motion users. The shape is shaded with a
// radial gradient plus a specular highlight so it reads as a rounded, 3D body,
// and a blurred copy underneath glows in time so the beat carries at a glance.
const Heartbeat = (): JSX.Element => {
  const reduced = useReducedMotion() ?? false
  // Keyframes of the cardiac cycle, normalised to one ~1.4s loop.
  const beat = { scale: [1, 1.22, 1.02, 1.13, 1, 1], times: [0, 0.1, 0.2, 0.3, 0.42, 1] }
  const D = 1.4
  // Clean, symmetric heart silhouette.
  const PATH =
    'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'

  return (
    <div className="relative grid h-16 w-16 place-items-center">
      {/* glow */}
      <m.svg
        viewBox="0 0 24 24" aria-hidden
        className="absolute h-12 w-12 text-accent blur-md"
        animate={reduced ? undefined : { opacity: [0.3, 0.75, 0.4, 0.6, 0.3], scale: beat.scale }}
        transition={reduced ? undefined : { duration: D, times: beat.times, repeat: Infinity, ease: 'easeInOut' }}
      >
        <path d={PATH} fill="currentColor" />
      </m.svg>
      {/* shaded 3D heart */}
      <m.svg
        viewBox="0 0 24 24" role="img" aria-label="Heartbeat"
        className="relative h-11 w-11"
        style={{ transformOrigin: 'center', filter: 'drop-shadow(0 3px 5px oklch(0.13 0.013 245 / 0.6))' }}
        animate={reduced ? undefined : { scale: beat.scale }}
        transition={reduced ? undefined : { duration: D, times: beat.times, repeat: Infinity, ease: 'easeInOut' }}
      >
        <defs>
          {/* Body shading: bright teal top-left lobe → deep teal base. */}
          <radialGradient id="heart3d" cx="38%" cy="30%" r="78%">
            <stop offset="0%" stopColor="oklch(0.92 0.13 195)" />
            <stop offset="42%" stopColor="oklch(0.78 0.15 200)" />
            <stop offset="100%" stopColor="oklch(0.52 0.13 215)" />
          </radialGradient>
        </defs>
        <path d={PATH} fill="url(#heart3d)" />
        {/* specular highlight on the left lobe */}
        <ellipse cx="8" cy="8" rx="2.6" ry="1.8" fill="#fff" opacity="0.55" transform="rotate(-32 8 8)" />
      </m.svg>
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
            <Heartbeat />
          </div>
        </m.div>

        <LaserLine start={inView} reduced={reduced} onDone={() => { setWritten(true) }} />

        <m.div {...fade}>
          <div className="mx-auto mt-10 flex items-center justify-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="h-px w-12 bg-hairline-soft" />
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          </div>
          <p className="mt-10 font-sans text-[0.8rem] text-faint">
            © 2026 AETHER · Aura. All renders and footage are AI-generated.
          </p>
          <p className="mt-2 font-mono text-[0.7rem] text-faint/60">{__COMMIT_SHA__}</p>
        </m.div>
      </div>
    </footer>
  )
}

export default Footer
