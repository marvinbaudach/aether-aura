import type { JSX, ReactNode } from 'react'
import { INF_PATH } from './infinityPath'

interface Row {
  n: string
  h: string
  t: string
  stat: ReactNode
  unit: string
  icon: JSX.Element
}

// Line-art glyphs (inherit the accent colour via currentColor).
const DisplayIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
    <rect x="4" y="9.5" width="16" height="10.5" rx="2.4" />
    <path d="M7.5 6.2h9M9.5 3.2h5" />
  </svg>
)
const AtomIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
    <circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none" />
    <ellipse cx="12" cy="12" rx="10" ry="4.2" />
    <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" />
    <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" />
  </svg>
)
const DepthIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
    <path d="M3 7.5c2 0 2 1.6 4 1.6S11 7.5 13 7.5s2 1.6 4 1.6 2-1.6 4-1.6" />
    <path d="M3 12.5c2 0 2 1.6 4 1.6s4-1.6 6-1.6 2 1.6 4 1.6 2-1.6 4-1.6" />
    <path d="M3 17.5c2 0 2 1.6 4 1.6s4-1.6 6-1.6 2 1.6 4 1.6 2-1.6 4-1.6" />
  </svg>
)

// Instrument Sans has no infinity glyph, so a typed ∞ would fall back to
// whatever the OS ships. Draw it at the figure's size and weight instead.
const InfinityFigure = (): JSX.Element => (
  <svg viewBox="24 16 72 28" role="img" aria-label="Infinity" className="relative top-[0.04em] inline-block h-[0.74em] w-auto align-baseline" fill="none">
    <path d={INF_PATH} stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const rows: Row[] = [
  {
    n: '01',
    h: 'Holographic sapphire display',
    t: 'A flush 0.8 mm sapphire lens that lifts your data into the air above the glass.',
    stat: '0.8',
    unit: 'mm sapphire',
    icon: DisplayIcon,
  },
  {
    n: '02',
    h: 'Lifetime nuclear cell',
    t: 'A sealed radioisotope rod runs the Aura for a lifetime. It is never charged or opened.',
    stat: <InfinityFigure />,
    unit: 'years sealed',
    icon: AtomIcon,
  },
  {
    n: '03',
    h: 'Sealed to 500 metres',
    t: 'Sealed past where any phone would drown, and it films 4K video from your wrist.',
    stat: '500',
    unit: 'm depth',
    icon: DepthIcon,
  },
]

const SpecRow = ({ r }: { r: Row }): JSX.Element => (
  <div className="relative grid grid-cols-[auto_1fr] items-center gap-x-[clamp(1rem,3vw,2.5rem)] gap-y-2 border-t border-hairline-soft py-[clamp(2rem,4.5vh,4rem)] md:grid-cols-[auto_1fr_auto]">
    <span className="grid h-11 w-11 place-items-center self-start rounded-full border border-hairline-soft bg-bg-soft text-accent md:h-12 md:w-12">
      <span className="h-6 w-6">{r.icon}</span>
    </span>

    <div className="min-w-0">
      <h3 className="font-display text-[clamp(1.4rem,3vw,2.4rem)] font-medium leading-[1.06]">{r.h}</h3>
      <p className="mt-3 max-w-[52ch] font-sans text-[1.05rem] text-muted">{r.t}</p>
    </div>

    <p className="col-start-2 mt-1 flex items-baseline gap-2 md:col-start-3 md:mt-0 md:flex-col md:items-end md:text-right">
      <span className="font-display text-[clamp(1.75rem,3vw,2.2rem)] font-semibold leading-none text-ink">{r.stat}</span>
      <span className="font-sans text-[0.9rem] text-muted">{r.unit}</span>
    </p>
  </div>
)

const Specs = (): JSX.Element => {
  return (
    <section id="specs" className="cv-section mx-auto flex min-h-svh max-w-shell flex-col justify-center px-[max(1.25rem,6vw)] py-[clamp(4rem,9vh,6.5rem)]">
      <h2 className="sr-only">Specifications</h2>
      {rows.map((r) => (
        <SpecRow key={r.n} r={r} />
      ))}
    </section>
  )
}

export default Specs
