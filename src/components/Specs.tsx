import type { JSX } from 'react'
import { m, useReducedMotion } from 'framer-motion'
import { ease } from '../anim'
import RevealText from './RevealText'

interface Row {
  n: string
  h: string
  t: string
  stat: string
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

const rows: Row[] = [
  {
    n: '01',
    h: 'Holographic sapphire display',
    t: 'A 0.8 mm sapphire lens set flush to the case, paired with a volumetric projection layer that lifts your data into the air above the glass.',
    stat: '0.8',
    unit: 'mm sapphire',
    icon: DisplayIcon,
  },
  {
    n: '02',
    h: 'Lifetime nuclear cell',
    t: 'A sealed radioisotope fuel rod keeps the Aura running for a full lifetime — never charged, never opened, never refuelled. One watch. One life. One rod.',
    stat: '∞',
    unit: 'years sealed',
    icon: AtomIcon,
  },
  {
    n: '03',
    h: 'Abyss-sealed to 500 metres',
    t: 'The titanium monocoque keeps its seal far below where any phone would drown — and a pair of sapphire-covered lenses capture stills and 4K video of the deep, straight from your wrist.',
    stat: '500',
    unit: 'm depth',
    icon: DepthIcon,
  },
]

const SpecRow = ({ r }: { r: Row }): JSX.Element => {
  const reduced = useReducedMotion() ?? false

  // One container drives the whole row; children animate in sequence so the
  // accent bar draws first, then the icon, number and the big stat snap up.
  return (
    <m.div
      className="group relative grid grid-cols-[auto_1fr] items-center gap-x-[clamp(1rem,3vw,2.5rem)] gap-y-2 py-[clamp(2rem,4.5vh,4rem)] md:grid-cols-[auto_1fr_auto]"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-12%' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
    >
      {/* top hairline that draws across as the row arrives */}
      <m.span
        aria-hidden
        className="absolute left-0 top-0 h-px w-full origin-left bg-gradient-to-r from-accent/60 via-hairline-soft to-transparent transition-[filter] group-hover:[filter:drop-shadow(0_0_6px_var(--accent))]"
        variants={{ hidden: { scaleX: 0, opacity: 0 }, show: { scaleX: 1, opacity: 1 } }}
        transition={{ duration: reduced ? 0 : 0.7, ease }}
      />

      {/* index + icon stack */}
      <m.div
        className="flex items-center gap-3 self-start"
        variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0 } }}
        transition={{ duration: reduced ? 0 : 0.5, ease }}
      >
        <span className="font-display text-[clamp(1.3rem,2.2vw,2rem)] text-accent">{r.n}</span>
        <span className="grid h-11 w-11 place-items-center rounded-full border border-hairline-soft bg-bg-soft text-accent transition-colors group-hover:border-accent/50 group-hover:bg-accent/10 md:h-12 md:w-12">
          <span className="h-6 w-6">{r.icon}</span>
        </span>
      </m.div>

      {/* heading + body */}
      <div className="min-w-0">
        <RevealText
          as="h3"
          text={r.h}
          className="font-display text-[clamp(1.4rem,3vw,2.4rem)] font-medium leading-[1.06]"
        />
        <RevealText
          as="p"
          text={r.t}
          delay={0.1}
          stagger={0.01}
          duration={0.5}
          className="mt-3 max-w-[52ch] font-sans text-[1.05rem] text-muted"
        />
      </div>

      {/* oversized stat figure */}
      <m.div
        className="col-start-2 mt-1 flex items-baseline gap-2 md:col-start-3 md:mt-0 md:flex-col md:items-end md:text-right"
        variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
        transition={{ duration: reduced ? 0 : 0.6, ease, delay: reduced ? 0 : 0.15 }}
      >
        <span className="font-display text-[clamp(2.6rem,7vw,5rem)] font-semibold leading-none text-gradient-accent [filter:drop-shadow(0_0_18px_oklch(0.78_0.15_200/0.35))]">
          {r.stat}
        </span>
        <span className="font-sans text-[0.72rem] uppercase tracking-[0.28em] text-muted">{r.unit}</span>
      </m.div>
    </m.div>
  )
}

const Specs = (): JSX.Element => {
  return (
    <section id="specs" className="mx-auto max-w-shell px-[max(1.25rem,6vw)] py-[clamp(5rem,12vh,12rem)]">
      {rows.map((r) => (
        <SpecRow key={r.n} r={r} />
      ))}
    </section>
  )
}

export default Specs
