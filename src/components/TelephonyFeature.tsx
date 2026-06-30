import type { JSX } from 'react'
import { m, useReducedMotion } from 'framer-motion'
import Reveal from './Reveal'

// Single source of truth for the handset glyph (used for both decline and
// accept, the decline simply rotated).
const PhoneGlyph = ({ className }: { className?: string }): JSX.Element => {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.3 1z" />
    </svg>
  )
}

const EQ_BARS = [0.4, 0.9, 0.6, 1, 0.5, 0.8, 0.45]

// In-page incoming-call widget. Concentric ripples pulse outward from the
// avatar, the accept button glows, and a faint equalizer hints at live audio.
// All looping motion is suppressed for reduced-motion users.
const CallWidget = (): JSX.Element => {
  const reduced = useReducedMotion() ?? false

  return (
    <div className="relative grid place-items-center overflow-hidden rounded-3xl border border-hairline-soft bg-bg-soft p-8">
      <div className="relative grid h-28 w-28 place-items-center">
        {/* Soft sonar: thin cyan light rings emanate from the avatar as it rings,
            fading in then out so they read as a clean signal, not heavy circles.
            Clipped by the card so they never bleed into the copy above. */}
        {!reduced &&
          [0, 1, 2, 3].map((n) => (
            <m.span
              key={n}
              aria-hidden
              className="absolute h-20 w-20 rounded-full border border-accent/50"
              style={{ boxShadow: '0 0 14px oklch(0.82 0.14 205 / 0.25)' }}
              animate={{ scale: [1, 2.4], opacity: [0, 0.55, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: n * 0.75, ease: 'easeOut', times: [0, 0.12, 1] }}
            />
          ))}
        {/* A light arc circles the avatar — the same motif as the reserve button,
            tying the two sections together. */}
        <span aria-hidden className="btn-halo pointer-events-none absolute h-22 w-22 rounded-full" style={{ filter: 'blur(2px)' }} />
        <div className="relative grid h-20 w-20 place-items-center rounded-full border border-accent/50 bg-bg-lift text-accent">
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4 3.5-6 8-6s8 2 8 6" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <p className="mt-7 font-display text-[1.5rem] font-medium text-ink">Alex Morgan</p>
      <p className="font-sans text-[0.82rem] uppercase tracking-[0.28em] text-muted">incoming · cellular</p>

      {/* equalizer */}
      <div className="mt-5 flex h-6 items-end gap-1">
        {EQ_BARS.map((h, i) => (
          <m.span
            key={i}
            className="w-1 rounded-full bg-accent/70"
            animate={reduced ? { scaleY: h } : { scaleY: [h * 0.4, h, h * 0.4] }}
            transition={reduced ? undefined : { duration: 0.9, repeat: Infinity, delay: i * 0.09, ease: 'easeInOut' }}
            style={{ height: 22, transformOrigin: 'bottom' }}
          />
        ))}
      </div>

      <div className="mt-7 flex items-center gap-6">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-[oklch(0.3_0.02_25)] text-[oklch(0.8_0.12_25)]">
          <PhoneGlyph className="h-5 w-5 rotate-135" />
        </span>
        <m.span
          className="grid h-14 w-14 place-items-center rounded-full bg-accent text-bg"
          animate={reduced ? undefined : { boxShadow: ['0 0 0px var(--accent)', '0 0 26px var(--accent)', '0 0 0px var(--accent)'] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <PhoneGlyph className="h-6 w-6" />
        </m.span>
      </div>
    </div>
  )
}

const TelephonyFeature = (): JSX.Element => {
  return (
    <section id="connect" className="cv-section relative flex min-h-svh snap-start flex-col justify-center bg-bg px-[max(1.25rem,6vw)] py-[clamp(4rem,9vh,6.5rem)]">
      <div className="mx-auto w-full max-w-2xl text-center">
        <Reveal className="relative">
          <p className="font-sans text-[0.74rem] uppercase tracking-[0.34em] text-accent">On the go</p>
          <h2 className="mt-4 font-display text-[clamp(2rem,4.4vw,3.4rem)] font-medium leading-[1.04] text-gradient">
            Leave the phone. Keep the call.
          </h2>
          <p className="mx-auto mt-6 max-w-[46ch] font-sans text-[1.08rem] text-muted">
            A built-in cellular radio and a precision microphone array let you
            take calls, dictate messages and stream — all from your wrist, with
            your phone three rooms away.
          </p>
          <div className="mx-auto mt-9 max-w-[360px]">
            <CallWidget />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default TelephonyFeature
