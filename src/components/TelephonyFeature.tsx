import type { JSX } from 'react'

// Single source of truth for the handset glyph (used for both decline and
// accept, the decline simply rotated).
const PhoneGlyph = ({ className }: { className?: string }): JSX.Element => {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.3 1z" />
    </svg>
  )
}

// In-page incoming-call widget. Static: the accept button and avatar carry the
// accent, nothing loops.
const CallWidget = (): JSX.Element => (
  <div className="relative grid place-items-center rounded-2xl border border-hairline-soft bg-bg-soft p-8">
    <div className="grid h-20 w-20 place-items-center rounded-full border border-accent/50 bg-bg-lift text-accent">
      <svg viewBox="0 0 24 24" aria-hidden className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.5-6 8-6s8 2 8 6" strokeLinecap="round" />
      </svg>
    </div>

    <p className="mt-6 font-display text-[1.5rem] font-medium text-ink">Alex Morgan</p>
    <p className="font-sans text-[0.9rem] text-muted">Incoming cellular call</p>

    <div className="mt-7 flex items-center gap-6">
      <span role="img" aria-label="Decline" className="grid h-12 w-12 place-items-center rounded-full bg-[oklch(0.3_0.02_25)] text-[oklch(0.8_0.12_25)]">
        <PhoneGlyph className="h-5 w-5 rotate-135" />
      </span>
      <span role="img" aria-label="Accept" className="grid h-14 w-14 place-items-center rounded-full bg-accent text-bg">
        <PhoneGlyph className="h-6 w-6" />
      </span>
    </div>
  </div>
)

const TelephonyFeature = (): JSX.Element => {
  return (
    <section id="connect" className="cv-section relative flex min-h-svh flex-col justify-center bg-bg px-[max(1.25rem,6vw)] py-[clamp(4rem,9vh,6.5rem)]">
      <div className="mx-auto grid w-full max-w-shell items-center gap-10 md:grid-cols-2 md:gap-16">
        <div className="mx-auto w-full max-w-[360px] md:order-1 md:justify-self-start">
          <CallWidget />
        </div>
        <div className="md:order-2">
          <h2 className="max-w-[16ch] font-display text-[clamp(2rem,4.4vw,3.4rem)] font-medium leading-[1.04]">
            Take calls from your wrist.
          </h2>
          <p className="mt-6 max-w-[46ch] font-sans text-[1.08rem] text-muted">
            A built-in cellular radio and a precision microphone array let you
            take calls, dictate messages and stream from your wrist, with your
            phone three rooms away.
          </p>
        </div>
      </div>
    </section>
  )
}

export default TelephonyFeature
